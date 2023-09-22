# vmc-input

## Utilisation

Le composant `vmc-input` peut être utilisé de différentes manières et contient plusieurs styles différents.
Il prend en charge plusieurs types de saisies : `text`, `number`, `password`, `date`, `time`, `email`, `tel`, `url`, `address`, `textarea`,`select`, `checkbox` et `toggle`. Il peut également afficher une icône et une unité de mesure*.

**⚠️Attention :** *Si vous utilisez des unités de mesure et le type tel, vous devez passer la props "modal-style" à true*
```html
<vmc-input unit="some-unit" :modal-style="true" />
```

## Propriétés

_

*requis - expecté pour les types "checkbox"*
| Propriété | Type | Description | Valeur par défaut |
| --- | --- | --- | --- |
| type | String | Type d'input | 'text' |
| placeholder | String | Texte d'aide dans l'input | '' |
| label | String | Label de l'input | '' |

_

*Optionel*
| Propriété | Type | Description | Valeur par défaut |
| --- | --- | --- | --- |
| modal-style | Boolean | Si l'input est dans une modal ou non | false |
| required | Boolean | Si l'input est obligatoire ou non | false |
| disabled | Boolean | Si l'input est désactivé ou non | false |
| unit | String | Unité de mesure pour l'input. ⚠️ _Si unit !== null, modal-style doit être true_ | null |
| value | String ou Number | value de l'input | null |
| geocoder | Boolean |Précise l'utilisation de l'api Geocoder. Minimum 5 caractères. Renvois une liste de 5 adresses | false |
| icon | Array/String | Icône pour l'input | null |
| step | Number | Permet d'incrementé la valeur d'un pas défini | 1 |
| min | String ou Number | Permet de définir la valeur minimal | null |
| max | String ou Number | Permet de définir la valeur maximal | null |
| select-options | IInputSelectOptions | Permet d'ajouter la liste des options | null |
| error | String | Message d'erreur pour l'input | 'ERROR_MESSAGE' |
| error-grow | Boolean | Permet d'afficher un espace vide en attente d'erreur | false |
| slot | String | Permet d'ajouter du contenu HTML dans le VMC input | null |

## Option disponible en fonction des types

Le tableau ci-dessous présente les différentes fonctionnalités et options disponibles pour chaque type d'input dans le composant vmc-input. Il indique quels attributs sont compatibles avec chaque type d'input, tels que `modal-style`, `disabled`, `required`, `label`, `error`, `icon`, `unit`, `value`, `step`, `min`, `max`, `select-options`, `slot` et `error-grow`.

| Type d'input | modal-style | disabled | requried | label | error | error-grow | icon | unit | value | step | min | max | slot |  select-options | Type V-modal |
|------------|:-----------:|:--------:|:--------:|:-----:|:-----:|:----:|:----:|:----:|:-----:|:----:|----:|:---:|:---:|:--------------:|------------|
| `Text`       | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |❌ | string |
| `number`     | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |❌ | number |
| `password`   | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |❌ | string |
| `date`       | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |❌ | string |
| `time`       | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |❌ | string |
| `email`      | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |❌ | string |
| `tel`        | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |❌ | string |
| `url`        | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |❌ | string |
| `address`    | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |❌ | IAddress |
| `select`     | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |✅ | IInputSelectOptions\<T\> |
| `textarea`   | ✅  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |❌ | string |
| `checkbox`   | ❌  | ✅  | ✅ | ✅ |  ✅ |  ✅ |  ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |❌ | boolean |
| `toggle`     | ❌  | ✅  | ❌ | ❌ |  ✅ |  ✅ |  ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |❌ | boolean |


## Option min et max

Le tableau suivant met en évidence l'utilisation des options `min` et `max` pour différents types d'inputs dans le composant `vmc-input`. Il présente des exemples concrets de la manière dont ces options peuvent être appliquées pour limiter la plage de valeurs acceptables pour les inputs `number`, `date` et `time`. En utilisant ces options, vous pouvez contrôler efficacement les données entrées par les utilisateurs et garantir qu'elles respectent les limites définies.

| Type d'input | exemple |
| --- | --- |
| `number` | min="5", min="2.2" |
| `date` | min="01/01/2023"|
| `time` | min="08:30" |


## Option step
Pour un input de type `number`, l'attribut `step` permet de réaliser des incréments d'une valeur définie. Pour un type `time`, l'attribut `step` permet également d'afficher les secondes ou non. Si la valeur de `step` est supérieure ou égale à 60, le format passe à HH:mm.


## Événements

| Événement | Description |
| --- | --- |
| iconClick | Se déclenche lorsqu'on clique sur l'icône |
| input | Se déclenche lorsqu'on saisit dans l'input |
| change | Se déclenche lorsqu'on modifie la valeur de l'input |


## Type select

Le code ci-dessous illustre un exemple d'utilisation du type select dans le composant `vmc-input`. Il présente comment configurer et utiliser un champ de sélection avec des options définies. Dans cet exemple, le champ `select` est lié à la variable `selectedOption` à l'aide de la directive `v-model`, et la liste des options est passée en utilisant l'attribut `select-options`. Les données d'exemple proviennent d'un fichier de données mockup, `skills`, qui sont ensuite transformées en un format approprié pour les options. 

```HTML
<vmc-input v-model="selectedOption" label="Nom" type="select" :select-options="options" />
```
```TS
import { skills } from '@/tests/data-mockups/skills'

const selectedOption = ref<IInputSelectOptions<Skill>>()

const options: Array<IInputSelectOptions<Skill>> = skills.map((element) => ({ value: element, display: element.label }))
```

Il est possible d'avoir une option `selected` (option qui sera sélectionner par défaut) ou `disabled` (option qui sera grisé et non selectionnable)

```TS
import { SelectOptionStates } from '@/types/constants'

const options = [
  { value: 'option1', display: 'Option 1', },
  { value: 'option2', display: 'Option 2', state: SelectOptionStates.DISABLED },
  { value: 'option3', display: 'Option 3', state: SelectOptionStates.SELECTED },
  { value: 'option3', display: 'Option 4' }
]
```

## Slot
Le composant `vmc-input` offre la possibilité d'ajouter un `slot` personnalisé, permettant d'insérer du contenu HTML supplémentaire à l'intérieur du composant, comme des liens ou du texte formaté.
### Exemple
```HTML
<vmc-input
  id="idCondition"
  v-model="checkboxInput"
  type="checkbox"
  error="Ceci est une erreure"
>
  <label for="idCondition" class="small">
    En cochant cette case, j'affirme que j'ai lu et accepté les
    <nuxt-link to="/">
      conditions générales d'utilisation
    </nuxt-link>
    et je m'engage à appliquer la
    <nuxt-link to="/">
      charte écologique
    </nuxt-link>
    du site valuemycar.fr
  </label>
</vmc-input>
``` 

## Examples

```html
<form>
  <fieldset>
    <legend>Formular example</legend>

    <!-- input classique -->
    <vmc-input 
      type="text" 
      label="Nom" 
      placeholder="Entrez votre nom" 
    />

    <!-- input classique avec icon cliquable -->
    <vmc-input
      type="text"
      label="Lastname"
      placeholder="Lastname"
      icon="fa-solid fa-circle-check"
      @icon-click="function_ex"
    />

    <!-- gestion d'erreur -->
    <vmc-input
      type="email"
      label="Email"
      placeholder="Email"
      error='Veuillez saisir un email valide ex:"example@domain.com"'
    />

    <!-- Permet d'afficher un espace vide en attente d'un message d'erreur -->
    <vmc-input
      type="email"
      label="Email"
      placeholder="Email"
      error-grow
      :error='messageError'
    />
    <!-- checkobox désactivé -->
    <vmc-input 
      type="checkbox" 
      label="Is already checked" 
      disabled 
    />

    <!-- geocoder activer -->
    <vmc-input  
      modal-style 
      label="Adresse" 
      type="address" 
      placeholder="Adresse" 
      geocoder 
    />

    <!-- input style time permettant sous le format HH:mm limité entre 8h00 et 18h00 -->
    <vmc-input 
      v-model="textInput" 
      type="time" 
      label="test" 
      step="60" 
      min="08:00" 
      min="18:00" 
      modal-style 
    />

    <!-- input style textarea -->
    <vmc-input 
      v-model="textInput" 
      type="textarea" 
      label="test"
      placeholder="Ceci est un placeholder" 
    />

    <!-- input style select -->
    <vmc-input 
      v-model="selectedOption" 
      label="Compétences"
      type="select" 
      :select-options="options" 
    />

    <!-- input style Modal et unité de mesure -->
    <vmc-input 
      type="number"
      modal-style 
      label="Mobilité" 
      placeholder="Mobilité" 
      icon="fa-solid fa-chevron-down" 
      unit="km" 
    />

    <!-- checkbox sous forme de toggle -->
      <vmc-input 
        type="toggle"
        v-model="toggleInput" 
      />

  </fieldset>
</form>
```
