export {}
declare global {
  interface InseeCompanyUniteLegale {
    activitePrincipaleUniteLegale: string
    categorieJuridiqueUniteLegale: string
    denominationUniteLegale: string
  }
  interface InseeCompanyAdresseEtablissement {
    numeroVoieEtablissement: string
    typeVoieEtablissement: string
    libelleVoieEtablissement: string
    libelleCommuneEtablissement: string
    codeCommuneEtablissement: string
  }
  interface InseeCompanyEtablissement {
    adresseEtablissement: InseeCompanyAdresseEtablissement
    uniteLegale: InseeCompanyUniteLegale
  }
  interface InseeCompany {
    etablissement: InseeCompanyEtablissement
  }
}
