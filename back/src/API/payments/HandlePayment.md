# Gérer un paiement

## 1 - Controller

C'est le service qui a besoin du paiement qui va devoir créer une route pour le gérer, la raison dérrière est que l'Id du paiement va devoir être sauvegardé par le service pour pouvoir être tenu au courant que le paiement ai été validé par l'utilisateur (voir '4 - Webhook')

La route doit forcément return le clientSecret du paymentIntent afin que le user puisse valider le paiement avec sa carte dans le Front

## 2 - Process

Dans son process, le service qui gère le paiement doit d'abord générer un paymentIntent avec la fonction `paymentsService.createPaymentIntent()`

Sauvegarder ensuite l'id du paymentIntent

## 3 - Response

La response doit être la clientSecret du paymentIntent pour l'utilisateur puisse valider le paiement localement

## 4 - Webhook

Une fois le paiement validé, un message sera envoyé sur /webhook/:Company/stripe le service devra avoir une fonction `findByPaymentId` pour retrouver l'objet concerné par son Id et update son status