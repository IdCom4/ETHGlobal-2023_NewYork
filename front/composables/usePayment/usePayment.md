# UsePayment

Le composable usePayment permet d'intéragir avec tout ce qui est relatif au moyen de paiement de l'utilisateur. C'est un composable dont le comportement est indiférent des outils pouvant mener à bien son utilisation

## Features

- Récupérer la liste des cartes de crédit de l'utilisateur
- Ajouter une carte de crédit
- Supprimer une carte de crédit
- Récupérer la carte de crédit par défaut
- Définir une carte de crédit par défaut

## Ajouter une carte de crédit

Pour des raisons de protections des données, l'ajout de carte de crédit ne passe pas par notre API, elle passe par l'outil de paiment que l'on utilise. Une fois le moyen de paiment ajouté, un webhook sera envoyé de l'outil externe à l'API de VMC pour que l'on soit au courant de la validation.

Il est possible de passer directement par l'API externe pour ajouter une carte mais aussi par une interface d'ajout fourni par ce dernier (comme l'interface d'ajout de carte de crédit de Stripe)

## Usage
-----

### Ajouter une carte par l'API externe

```Typescript
addPaymentMethod: (payload: ICreditCardPayload, alert?: IAlertControl) => Promise<IRequestResult<ICreditCard>>
```
Prend en paramètre une payload universel de carte de crédit et fait un appel à l'API externe pour ajouter le moyen de paiement. Si l'opération est un succès, récupère un wrapper de la carte de crédit

### Ajouter une carte par l'interface d'ajout fourni par l'outil

```Typescript
mountPaymentInput: (elementWrapper: HTMLElement) => Promise<TSubmitFunction>
```

prend en paramètre un élement HTML sur lequel monter l'interface d'ajout provenant l'outil extérieur et renvoie une fonction à appeler pour valider les informations de la carte et faire un appel API afin d'ajouter de celle-ci


###  Récupérer la liste des cartes de crédits

```Typescript
getPaymentMethods: (alert?: IAlertControl) => Promise<IRequestResult<ICreditCard[]>>
```

Récupère la liste des cartes de l'utilisateur connecté et renvoie un tableau de ce dernier

### Supprimer une carte de crédit

```Typescript
deletePaymentMethod: (paymentMethodId: string, alert?: IAlertControl) => Promise<IRequestResult<boolean>>
```

Prend en paramètre l'id de la carte à supprimer et renvoie un booléen à l'état true en cas de succès

### Récupérer la carte utilisée par défaut

```Typescript
getDefaultPaymentMethod: (alert?: IAlertControl) => Promise<IRequestResult<ICreditCard>>
```

Récupère la carte de crédit utilisée par défaut par l'utilisateur connecté

### Mettre à jour la carte utilisée par défaut

```Typescript
updateDefaultPaymentMethod: (paymentMethodId: string, alert?: IAlertControl) => Promise<IRequestResult<boolean>>
```

Prend en paramètre l'identifiant de la carte de crédit à définir comme carte par défaut, renvoie un booléen à l'état true en cas de succès
