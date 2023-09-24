export const originalArtists: IArtist[] = [
  { id: 0, name: 'David Guetta' },
  { id: 1, name: 'DJ Snake' },
  { id: 2, name: 'Sia' },
  { id: 3, name: 'Taylor Swift' },
  { id: 4, name: 'Bob Marley' },
  { id: 5, name: 'Maroon 5' },
  { id: 6, name: 'Kygo' },
  { id: 7, name: 'Nicky Minaj' },
  { id: 8, name: 'Afrojack' }
]

export const repostersArtists: IArtist[] = [
  { id: 9, name: 'Superman' },
  { id: 10, name: 'Dark Sasuke du 93' },
  { id: 11, name: 'Santa Claus' },
  { id: 12, name: 'Bart Simpson' },
  { id: 13, name: 'Cartman' },
  { id: 14, name: 'Shaggy & Scooby' },
  { id: 15, name: 'Cristophe Colomb' }
]

export const artists: IArtist[] = [...originalArtists, ...repostersArtists]

export const musics: IMusic[] = [
  {
    id: 100,
    authorId: originalArtists[0].id,
    pictureURL: 'https://i1.sndcdn.com/artworks-000628822861-pimol6-t500x500.jpg',
    title: 'Hey Mama',
    rating: 3
  },
  {
    id: 101,
    authorId: repostersArtists[0].id,
    pictureURL: 'https://m.media-amazon.com/images/I/712wMOHHX4L._UF1000,1000_QL80_.jpg',
    title: 'Woman No Cry',
    rating: 4
  },
  {
    id: 102,
    authorId: originalArtists[1].id,
    pictureURL: 'https://i1.sndcdn.com/artworks-000091536479-m3nhnu-t500x500.jpg',
    title: 'Get Low',
    rating: 2
  },
  {
    id: 103,
    authorId: repostersArtists[1].id,
    pictureURL: 'https://upload.wikimedia.org/wikipedia/en/d/d1/Maroon_5_Sugar_cover.png',
    title: 'Sugar',
    rating: 2
  },
  {
    id: 104,
    authorId: originalArtists[2].id,
    pictureURL: 'https://cdna.artstation.com/p/assets/images/images/014/085/880/medium/i-manipulate-shutterstock-740156368.jpg?1542390919',
    title: 'Chandelier',
    rating: 5
  },
  {
    id: 105,
    authorId: repostersArtists[2].id,
    pictureURL: 'https://dh22twu0ekfg6.cloudfront.net/media/auction_house/assets/31638/Auction%20Image%20-%20PJ.png',
    title: 'Stole The Show',
    rating: 1
  },
  {
    id: 106,
    authorId: originalArtists[3].id,
    pictureURL: 'https://static.wikia.nocookie.net/taylorswifts/images/c/c4/Cruel_Summer.jpg',
    title: 'Cruel Summer',
    rating: 4
  }
]
