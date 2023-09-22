# vmc-modal

## Utilisation
Le composant `vmc-modal` est une popup qui s'affiche en premier plan sur une page web. Une option de style `confirmation-style` peut être appliqué afin d'afficher de petite fenêtre de confirmation de type Oui/Non

Vous devez donné implémenter la variable booléenne `is-open` afin de pouvoir d'ouvrir ou  fermer la modal avec des boutons

**ATTENTION** : Si vous utilisez le VMC-input à l'interieur de cette modal, veuillez utiliser l'option "modal-style" Cela permet de garder une cohérence de style entre toutes les popups.

## Propriétés
| Propriété | Type | Description | Valeur par défaut |
| --- | --- | --- | --- |
| is-open | Boolean | variable pilotant l'affichage de la modal | false |
| title | String | Permet d'inserer un titre à la modal | "" |
| slot | HTML | Le contenu de la fenêtre pop-up |  |
| confirmation-style | Boolean | Change le style de la popup | false |

## Initialisation

Pour initialiser la modal, définir la modal avec un ref:
```HTML
<vmc-modal :is-open="isModalPasswordOpen" title="Modification de votre mot de passe" @close="closeModalPassword">
<!-- Content of modal-->
</vmc-modal>
```

```HTML
<button @click="openModalPassword">Open</button>
```

```JS
const isModalPasswordOpen = ref<boolean>(false)

const openModalPassword = () => {
  isModalPasswordOpen.value = true
}

const closeModalPassword = () => {
  isModalPasswordOpen.value = false
}
```
Vous pouvez ensuite créer un bouton permetant de l'ouvrir, ou de la fermer en utilisant les fonction `openModal` et `closeModal` 

*ATTENTION:* Le bouton close doit être dans la modal (une croix de fermeture de la modal est automatiquement présente en haut à droite, mais il se peux que vous ayez besoins d'un bouton 'annuler' soit présent pour fermer la modal) 

```HTML
<button @close="closeModalPassword">Close</button>
```

## Exemple
```HTML
<button class="btn_functional" @click="openModalVehicles"><fa icon="fa-solid fa-plus" class="icon" />Ajoutez un véhicule</button>

<vmc-modal :is-open="isModalVehiclesOpen" title="Ajouter une facture">
  <div class="modal">
    <vmc-input type="text" label="Marque" placeholder="Marque" modal-style />
    <vmc-input type="text" label="Modèle" placeholder="Modèle" modal-style />
    <vmc-input type="text" label="Année" placeholder="Année" modal-style />
    <vmc-input type="text" label="Numéo d'immatriculation" placeholder="AB-123-CD" modal-style />
    <button class="btn-modal btn btn_call-to-action" @click="saveVehicule">Enregistrer</button>
  </div>
</vmc-modal>

  <!-- Création d'une modal avec l'option de style "confirmation-style" -->
<vmc-modal :is-open="isModalConfirmationOpen" title="Voulez-vous vraiment supprimer cette voiture ?" confirmation-style @close="closeModalConfirmation">
  <div class="modal">
    <div>
      <button class="btn-modal btn btn_call-to-action" @close="updateVehicle">Oui</button>
      <button class="btn_denied" @close="closeModalConfirmation">Non</button>
    </div>
  </div>
</vmc-modal>
```

```JS
const isModalVehiclesOpen = ref<boolean>(false)
const isModalConfirmationOpen = ref<boolean>(false)

const openModalConfirmation = () => {
  isModalConfirmationOpen.value = true
}

const closeModalConfirmation = () => {
  isModalConfirmationOpen.value = false
}

const openModalVehicles = () => {
  isModalVehiclesOpen.value = true
}

const closeModalVehicles = () => {
  isModalVehiclesOpen.value = false
}
```


