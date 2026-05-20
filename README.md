# Aplicativo Expo 

Este é um projeto [Expo](https://expo.dev) criado com o comando [`create-expo-app`](https://www.google.com/search?q=%5Bhttps://www.npmjs.com/package/create-expo-app%5D(https://www.npmjs.com/package/create-expo-app)).

---

## Como Começar

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Instalar as dependências

No seu terminal, execute:

```bash
npm install

```

### 2. Configurar o ambiente 

> **Nota sobre o Realm:** Como este aplicativo utiliza o **Realm** como banco de dados, o *Expo Go* tradicional não conseguirá executá-lo diretamente devido aos módulos nativos. É necessário gerar um **Development Build** (compilação de desenvolvimento).

Instale o cliente de desenvolvimento e execute o projeto no Android ou iOS:

```bash
# Instalar o cliente de desenvolvimento
npx expo install expo-dev-client

# Executar no Android
npx expo run:android

# Executar no iOS (se estiver no macOS)
npx expo run:ios

```

> **Dica:** Utilize o Android Studio, o simulador do Xcode ou um dispositivo físico configurado com o Expo Development Build para rodar esta lista de tarefas baseada em Realm.

---

## Desenvolvimento

Após iniciar o servidor, você verá as opções para abrir o aplicativo em diferentes ambientes:

* **[Development Build](https://docs.expo.dev/develop/development-builds/introduction/):** Recomendado para este projeto.
* **[Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/):** Simulador do Android Studio.
* **[iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/):** Simulador do Xcode (apenas macOS).
* **[Expo Go](https://expo.dev/go):** Um sandbox limitado (não recomendado para este projeto devido ao Realm).

Para começar a programar, edite os arquivos dentro do diretório **`app`**. Este projeto utiliza [roteamento baseado em arquivos (file-based routing)](https://docs.expo.dev/router/introduction).

---

## Limpar o Projeto 

Se você quiser remover o código de exemplo e começar um projeto totalmente limpo, execute:

```bash
npm run reset-project

```

Este comando moverá o código inicial para a pasta **`app-example`** e criará um diretório **`app`** totalmente em branco para você iniciar o seu desenvolvimento.

---

## Outras Configurações

* **Qualidade de Código:** Para configurar o ESLint, execute `npx expo lint` ou siga o guia sobre [Usando ESLint e Prettier](https://docs.expo.dev/guides/using-eslint/).
* **Testes Automatizados:** Se desejar configurar testes unitários, siga o guia de [Testes Unitários com Jest](https://docs.expo.dev/develop/unit-testing/).
* **TypeScript:** Saiba mais sobre a configuração do TypeScript inclusa neste template no guia [Usando TypeScript](https://docs.expo.dev/guides/typescript/).

---

## Saiba Mais

Para se aprofundar no desenvolvimento com Expo, confira os seguintes recursos oficiais:

* **[Documentação do Expo](https://docs.expo.dev/):** Aprenda os fundamentos ou explore tópicos avançados em nossos guias.
* **[Tutorial Aprenda Expo](https://docs.expo.dev/tutorial/introduction/):** Um passo a passo prático onde você criará um app que roda em Android, iOS e Web.

