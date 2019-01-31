document.addEventListener('DOMContentLoaded', initalize)

const baseUrl = "http://localhost:3000"
const trainersUrl = `${baseUrl}/trainers`
const pokemonsUrl = `${baseUrl}/pokemons`

const main = document.querySelector('.main')


function initalize() {
  getTrainers().then(trainers => {
    state.trainers = trainers
    addTrainersToPage(state.trainers)
  })
}

const state = {
  trainers: [],
  pokemons:[],
}

const addTrainersToPage = trainers => {
  const main = document.querySelector('.main')
  main.innerHTML = ''
  trainers.forEach(trainer => addTrainerToCard(trainer))
}

const addTrainerToCard = trainer => {

  state.pokemons = trainer.pokemons

  const trainerCard = document.createElement('div')
  trainerCard.className = 'card'
  trainerCard.dataset.id = trainer.id

  const trainerName = document.createElement('h2')
  trainerName.innerText = trainer.name

  const addPokemonButton = document.createElement('button')
  addPokemonButton.innerText = "Add Pokemon"
  addPokemonButton.dataset.id = trainer.id

  const pokemonList = document.createElement('div')

  const pokemonsHTML = state.pokemons.map(pokemon =>
    `<li class="pokemonEl" data-pokemon-id="${pokemon.id}">${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
  ).join("")

  pokemonList.innerHTML = pokemonsHTML

  const listItems = pokemonList.querySelectorAll('.pokemonEl')

  listItems.forEach( li => {
    li.querySelector('.release').addEventListener('click', onReleasePokemonClick)
  })

  trainerCard.append(trainerName, addPokemonButton, pokemonList)
  main.append(trainerCard)

  addPokemonButton.addEventListener('click', () => onAddPokemonClick(trainer))


}

const onAddPokemonClick = trainer => {
  event.preventDefault()
  addPokemon(trainer.id).then(() => getTrainers().then(addTrainersToPage))
}

const onReleasePokemonClick = () => {
  event.preventDefault()
  releasePokemon(event.target.dataset.pokemonId).then(() => {
    console.log('deleted')
    getTrainers().then(addTrainersToPage)
  })
}



const getTrainers = () => {
  return fetch(trainersUrl)
    .then(response => response.json())
}

const addPokemon = id => {
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      trainer_id: id
    })
  }

  return fetch(pokemonsUrl, options)
}

const releasePokemon = id => {
  const options = {
    method: "DELETE"
  }

  return fetch(pokemonsUrl + `/${id}`, options)
}
