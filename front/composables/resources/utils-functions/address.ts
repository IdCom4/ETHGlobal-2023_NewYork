class AddressUtils {
  static addressToString(adress: IAddress) {
    return `${adress.street}, ${adress.zipCode} ${adress.city}`
  }
  static stringToAddress(adressString: string): IAddress {
    const [street, zipCode, city] = adressString.split(', ').map((item) => item.trim())
    return {
      street: street,
      city: city,
      zipCode: zipCode
    }
  }
}

export default AddressUtils
