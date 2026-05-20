import { createRealmContext } from '@realm/react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TodoSchema = {
  name: 'Todo' as const,
  primaryKey: 'id' as const,
  properties: {
    id: 'string' as const,
    title: 'string' as const,
    done: { type: 'bool' as const, default: false },
    createdAt: 'date' as const,
  },
} as const;

const { RealmProvider, useQuery, useRealm } = createRealmContext({
  schema: [TodoSchema],
  deleteRealmIfMigrationNeeded: true,
});

type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
};

function TodoItem({ item }: { item: Todo }) {
  const realm = useRealm();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.title);

  useEffect(() => {
    setEditText(item.title);
  }, [item.title]);

  const toggleDone = () => {
    realm.write(() => {
      const todo = realm.objectForPrimaryKey<Todo>('Todo', item.id);
      if (todo) todo.done = !todo.done;
    });
  };

  const remove = () => {
    realm.write(() => {
      const todo = realm.objectForPrimaryKey<Todo>('Todo', item.id);
      if (todo) realm.delete(todo);
    });
  };

  const saveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed.length === 0) return;

    realm.write(() => {
      const todo = realm.objectForPrimaryKey<Todo>('Todo', item.id);
      if (todo) todo.title = trimmed;
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditText(item.title);
    setIsEditing(false);
  };

  return (
    <View style={styles.todoItem}>
      <View style={styles.todoTextContainer}>
        {isEditing ? (
          <TextInput
            style={[styles.inputField, styles.editInput]}
            value={editText}
            onChangeText={setEditText}
            onSubmitEditing={saveEdit}
            returnKeyType="done"
            autoFocus
          />
        ) : (
          <>
            <Text style={[styles.todoTitle, item.done && styles.todoTitleDone]}>{item.title}</Text>
            <Text style={styles.todoMeta}>
              {item.done ? 'Concluída' : 'Pendente'} • {item.createdAt.toLocaleDateString()}
            </Text>
          </>
        )}
      </View>

      <View style={styles.todoControls}>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={[styles.concludeButton, item.done && styles.concludedButton]} onPress={toggleDone}>
              <Text style={[styles.concludeButtonText, item.done && styles.concludedButtonText]}>{item.done ? 'Desfazer' : 'Concluir'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={remove}>
              <Text style={styles.deleteButtonText}>Apagar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function TodoApp() {
  const realm = useRealm();
  const todos = useQuery<Todo>('Todo').sorted('createdAt', true);
  const todoList = Array.from(todos);
  const completedCount = todoList.filter((todo) => todo.done).length;
  const [title, setTitle] = useState('');

  const { width } = useWindowDimensions();
  const titleFontSize = width < 360 ? 28 : width < 420 ? 32 : 34;

  const addTodo = () => {
    const trimmed = title.trim();
    if (trimmed.length === 0) return;

    realm.write(() => {
      realm.create('Todo', {
        id: generateId(),
        title: trimmed,
        done: false,
        createdAt: new Date(),
      });
    });

    setTitle('');
  };

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style="light" />
      <View style={styles.background} />

      <View style={styles.content}>
        <View style={styles.headerCard}>
          <Text style={[styles.title, { fontSize: titleFontSize }]}>To-do Realm</Text>
          <Text style={styles.subtitle}>Organize suas tarefas e salve tudo localmente usando Realm.</Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardSpacing]}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{todoList.length}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Concluídas</Text>
              <Text style={styles.statValue}>{completedCount}</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView style={styles.mainSection} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Nova tarefa</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Digite sua nova tarefa"
                placeholderTextColor="#94A3B8"
                style={[styles.inputField, styles.inputFieldSpacing]}
                onSubmitEditing={addTodo}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addButton} onPress={addTodo}>
                <Text style={styles.addButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.topBar}>
            <Text style={styles.sectionTitle}>Tarefas</Text>
          </View>

          <FlatList
            data={todoList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TodoItem item={item} />}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa cadastrada ainda.</Text>}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: '#020617',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerCard: {
    borderRadius: 32,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    shadowColor: '#0a192f',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    color: '#ffffff',
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 22,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  statCardSpacing: {
    marginRight: 12,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
  },
  mainSection: {
    flex: 1,
    marginTop: 18,
  },
  inputCard: {
    borderRadius: 28,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    marginBottom: 22,
  },
  inputLabel: {
    color: '#38bdf8',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 15,
  },
  inputFieldSpacing: {
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#22d3ee',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 15,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  emptyText: {
    marginTop: 28,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 15,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
    marginBottom: 14,
  },
  todoTextContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  todoTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  todoTitleDone: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  todoMeta: {
    color: '#94a3b8',
    marginTop: 6,
    fontSize: 12,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  todoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  concludeButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  concludedButton: {
    backgroundColor: '#64748b',
  },
  concludeButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  concludedButtonText: {
    color: '#e2e8f0',
  },
  editButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#38bdf8',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12,
  },
  cancelButton: {
    backgroundColor: '#475569',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  editInput: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    minWidth: 180,
  },
});

export default function App() {
  return (
    <RealmProvider>
      <TodoApp />
    </RealmProvider>
  );
}
