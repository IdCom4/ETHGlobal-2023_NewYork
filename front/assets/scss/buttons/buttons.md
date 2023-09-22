# Classes CSS pour les boutons

Cette feuille de style contient des classes CSS pour les boutons, avec des styles prédéfinis pour différents types de boutons.

## Utilisation

Pour utiliser les classes CSS, ajoutez simplement la classe correspondant au style souhaité à l'élément `<button>` :

```html
<button class="btn_functional">Bouton fonctionnel</button>

<button class="btn_call-to-action">Appel à l'action</button>

<button class="btn_denied">Bouton refusé</button>

<button class="btn_navigation">Bouton de navigation</button>

<button class="btn_disabled">Bouton désactivé</button>
```
## Définition

**btn_functional**

Cette classe est destinée aux boutons qui ont une fonctionnalité particulière, tels que le bouton *"Ajouter un experience"*. Les boutons avec cette classe auront un fond transparent et une police grise, avec une icône optionnelle à coté du texte.
___
**btn_call-to-action**

Cette classe est destinée aux boutons qui encouragent l'utilisateur à effectuer une action particulière, comme *ENVOYEZ*, *CONFIRMEZ*, *ENREGISTREZ*, etc.. Les boutons avec cette classe auront un fond bleu clair et une police blanche, et deviendront plus clairs au survol de la souris.
___
**btn_navigation**

Cette classe est destinée aux boutons qui permettent à l'utilisateur de naviguer entre différentes pages ou sections de l'application. Ils sont principalement utiliser dans les pages de tracking comme *"RETOURNEZ A VOS MISSIONS"* Les boutons avec cette classe auront un fond bleu clair et une police blanche, et prendront la largeur totale de leur parent.
___
**btn_disabled**

Cette classe est destinée aux boutons qui sont désactivés et ne peuvent pas être cliqués. Les boutons avec cette classe auront un fond blanc cassé et une police grise clair, avec une ombre douce et un "`css cursor: not-allowed;`"
pour indiquer qu'ils ne sont pas cliquable.
___
**--load**

Cette classe est à ajouter aux boutons qui sont en cours de chargement et ne peuvent pas être cliqués. Il permet un retour à l'utilisateur que sont action est en chargement. Les boutons avec cette classe auront un fond gris clair et une police grise foncée, avec l'icon de chargement VMC animée.