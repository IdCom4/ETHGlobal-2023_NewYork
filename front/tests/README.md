# **Documentation des tests unitaires**

## **1. Les règles de base**

  Le but d'un test unitaire est de vérifier que *l'objet du test* produit les **output** attendus en fonction des **inputs**

  Pour se faire il faut suivre les règles suivantes:
  1. je vérifie que l'objet de mon test fonctionne, pas comment il fonctionne
  2. je ne vérifie donc que les outputs produits par l'objet de mon test
  3. je ne vérifie pas que les autres éléments externes dont il dépend fonctionnent, je pars du principe que c'est le cas et je mock leur comportement attendu au besoin

  **Est considéré comme un input:**
  - le state
  - les paramètres / props
  - les events (systèmes, utilisateurs, depuis l'interface, etc ...)

  **Est considéré comme un output:**
  - les events émis
  - les données de retour
  - les appels à des éléments externes (composant, fonction, module, etc ...)
  - les données affichées (interface, HTML, console, etc ...)

<br/>

## **2. Les frameworks**

  Afin d'écrire et exécuter les tests unitaires, nous utilisons 2 frameworks:
  - **Vitest** ([doc officielle](https://vitest.dev/guide/)):
    - contexte d'exécution
    - fonction d'assertion
    - mock de fonctions et de modules
  - **Vue Test Utils** ([doc officielle](https://test-utils.vuejs.org/guide/)):
    - rendering isolé d'un composant
    - fonctions d'interactions avec le composant
    - mock de composant

<br/>

## **3. Les principales fonctions**

  Ces 2 frameworks vous mettent à disposition un grand nombre de fonctions afin de réaliser vos tests.
  Voici les principales:

  - **Vitest**:
    - **describe**:\
    Permet de créer un groupe de tests avec une description du contexte
      ```ts
      import { describe } from 'vitest'

      describe("when someFunction is called", () => { /* implémentation des tests */ })
      ```
    - **it**:\
    Permet de créer un test avec une description du comportement attendu
      ```ts
      import { it } from 'vitest'

      it("must return something", () => { /* implémentation du test */ })
      ```
    - **expect**:\
    Permet de tester la valeur d'une donnée
      ```ts
      import { expect } from 'vitest'

      // expect has many other test functions than 'toEqual'
      expect(someVariable).toEqual(someValue)
      ```
    - **beforeAll**:\
    Permet d'exécuter une fonction avant tous les tests d'un groupe
      ```ts
      import { beforeAll } from 'vitest'

      beforeAll(() => { /* opérations */ })
      ```
    - **beforeEach**:\
    Permet d'exécuter une fonction avant chaque test d'un groupe
      ```ts
      import { beforeEach } from 'vitest'

      beforeEach(() => { /* opérations */ })
      ```
    - **afterAll**:\
    Permet d'exécuter une fonction après tous les tests d'un groupe
      ```ts
      import { afterAll } from 'vitest'

      afterAll(() => { /* opérations */ })
      ```
    - **afterEach**:\
    Permet d'exécuter une fonction après chaque test d'un groupe
      ```ts
      import { afterEach } from 'vitest'

      afterEach(() => { /* opérations */ })
      ```
    - **spyOn**:\
    Permet de créer un spy d'une fonction afin d'avoir des informations concernant l'utilisation de cetter fonction dans le contexte du test
      ```ts
      import { vi } from 'vitest'

      const someFunctionSpy = vi.spyOn(someModule, 'someFunctionInsideThatModule')
      expect(someFunctionSpy).toHaveBeenCalled()
      ```
    - **mock**:\
      (<span style="color: yellow">*comportements spéciaux, [lire la doc](https://vitest.dev/api/vi.html#vi-mock)*</span>)\
      Permet d'exécuter une fonction avant tous les tests d'un groupe
      ```ts
      import { vi } from 'vitest'

      vi.mock('./path/to/module', async (importOriginal) => {
        const trueModule = await importOriginal()
        return {
          ...trueModule,
          // vous pouvez remplacer certains export du module par votre propre implémentation
          someNamedExport: vi.fn(),
        }
      })
      ```
  - **Vue Test Utils**
    - **mount**:\
    Permet de monter (rendre) un composant ainsi que tous ses composants enfants afin d'en tester le comportement
      ```ts
      import { mount } from '@vue/test-utils'
      import SomeComponent from '@/components/some/component.vue'

      const wrapper = mount(SomeComponent, { /* options, like state/props/stub/etc */})
      ```
    - **shallowMount**:\
    Permet de monter (rendre) un composant en remplacant ses composants enfants par des placeholders afin d'en tester le comportement
      ```ts
      import { shallowMount } from '@vue/test-utils'
      import SomeComponent from '@/components/some/component.vue'

      const wrapper = shallowMount(SomeComponent, { /* options, like state/props/stub/etc */})
      ```

<br/>

## **4. L'architecture de base**

  Voici un exemple de fichier de test reprenant un bonne architecture:
  ```ts
    import { beforeEach, describe, it, test } from 'vitest'
    import { shallowMount, VueWrapper } from '@vue/test-utils'
    import SomeComponent from '@/components/some/component.vue'

    // groupe de tests principal
    describe("when i use SomeComponent", () => {

      // sous groupe de tests pour la situation où je ne donne pas de props au composant
      describe("when i do not give it any props", () => {
        // création d'un wrapper pour ce groupe de tests
        let wrapper: VueWrapper

        // code a exécuter avant chaque test de ce groupe
        beforeEach(() => {

          // rendu du composant sans props
          wrapper = shallowMount(SomeComponent)

        })

        // test d'un comportement attendu
        it("should not render the main title", async () => {
          /*  les 3 commentaires suivants (given / when / then) sont à mettre réellement dans le code
              afin de se forcer à suivre leur structure */ 

          // given
          /*  dans ce test très simple il n'y a rien à faire ici,
              mais dans un test plus compliqué nous pourrions vouloir créer des mocks spécialement pour ce test,
              ou créer des variables de référence, ou n'importe quoi d'autre qui aurait planté le décor pour ce test */
          
          // when
          const mainTitleElement = wrapper.find('#main-title');

          // then
          expect(mainTitleElement).toBeFalsy()
        })

        // autres tests ...
      })

      // autre groupe de test
      describe('when i give it all the props', () => {
        // les tests correspondants ...
      })

    })
  ```
  > 💡\
  > *Notez que la description des **describe** commence par 'when',*\
  > *et que celle des **it** commence par un mot pouvant être utilisé après le mot 'it',*\
  > *afin de former une phrase facilement compréhensible.*
  >
  > *exemple:*\
  > *'when i do not give it any props', 'it should not render the main title'*

<br/>

## **5. Les Tips & Tricks**

  Lors de vos tests vous rencontrerez des situations dans lesquelles vous devrez mettre quelque chose en place et/ou aurez besoin de faire/déclancher certaines opérations.\
  Cette section est là pour répertorier toutes les techniques et outils les plus communément utilisés.

<br/>

### **Mock**

  Le mocking est un élément important des tests,\
  car comme expliqué plus haut nos tests de ne doivent pas dépendre d'autres éléments externes que celui qui est l'objet des tests.\
  De fait, tout ces éventuels autres éléments doivent être mocké.

  <br/>

  > 💡 *Dans vous tests, vous ne devez pas vous appuyer sur API, car leur état peut altérer le test, et ainsi le faire échouer temporairement alors que l'objet du test n'a pas changé et fonctionne encore*

  <br/>

  - **UseFetchWrapperMockBuilder**\
    Cette classe permet de mocker les appels aux API externes.\
    En effet, dans notre projet tous les appels API sont faits en bout de chaine par le composable **useFetchWrapper**\
    et la classe **UseFetchWrapperMockBuilder** permet de le mocker facilement, ainsi que d'en customiser le comportement.
    ```ts
    import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'

    // cette classe est un builder, qui permet donc de customiser le comportement du mock
    const mockBuilder = new UseFetchWrapperMockBuilder<SomeResponseType>()

    // on peut définir les valeurs de retour attendues que le vrai appel à l'API est censé renvoyer
    mockBuilder.call_setResponse({ data: someDataOrNull, error: anErrorOrNull }) 

    // à partir du moment où la méthode build() est appelée,
    // le mock est effectif et interceptera tous les appels fait au vrai useFetchWrapper
    const mock = mockBuilder.build()
    ```
    > 💡 *Comme tous les builders, les méthodes de la classe peuvent être chainées en un one-liner*
    ```ts
    import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'

    const mock = new UseFetchWrapperMockBuilder<SomeResponseType>()
                  .call_setResponse({ data: someDataOrNull, error: anErrorOrNull })
                  .build()
    ```
    > 💡 *Vous pouvez également lui envoyer une fonction pour tester que le mock a bien été appelé avec les bon paramètres*
    ```ts
    import { UseFetchWrapperMockBuilder } from '@/tests/mockups/functions/APIs'

    const mock = new UseFetchWrapperMockBuilder<SomeResponseType>()

    // la fonction prend un callback qui sera exécuté à l'appel du mock
    mock.call_setFunctionToTestParameters((url: string, options: IRequestOptions) => {
      expect(url).toEqual('some-url')
      expect(options?.headers).toBeDefined()
    })

    ```

### **Interactions avec les composants rendus**
*à écrire*