const autocompleteConfig = {
    renderOption(movie){
        const imgSRC = movie.Poster === "N/A" ? '' : movie.Poster
        return `
            <img src="${imgSRC}" />
            ${movie.Title} (${movie.Year})
       `
    },
    inputValue(movie){
        return movie.Title
    },
    async fetchData(search){
        const response = await axios.get('https://www.omdbapi.com/', {
            params:{
                apikey:'6a838efd',
                s:search
            }
        })
        if (response.data.Error){
            return []
        }
        return response.data.Search
    }
}

createAutocomplete(
    {
        autocomplete:document.querySelector("#left-autocomplete"),
        onOptionSelect(movie){
            document.querySelector('.tutorial').classList.add('is-hidden')
            return onMovieSelect(movie.imdbID, document.querySelector('#left-summary'), 'left')
        },
        ...autocompleteConfig
    })
createAutocomplete(
    {
        autocomplete:document.querySelector("#right-autocomplete"),
        onOptionSelect(movie){
            document.querySelector('.tutorial').classList.add('is-hidden')
            return onMovieSelect(movie.imdbID, document.querySelector('#right-summary'), 'right')
        },
        ...autocompleteConfig
    })


let leftMovie;
let rightMovie;
const onMovieSelect = async (id, summaryDiv, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params:{
            apikey:'6a838efd',
            i:id
        }
    })
    summaryDiv.innerHTML = movieTemplate(response.data)
    if (side === "left"){
        leftMovie = response.data
    }
    else{
        rightMovie = response.data
    }

    if(leftMovie && rightMovie){ 
        runComparison()
    }
}

const runComparison = () => {
    leftSideMovies = document.querySelectorAll('#left-summary .notification')
    rightSideMovies = document.querySelectorAll('#right-summary .notification')
    leftSideMovies.forEach((leftStats, idx) => {
        rightStats = rightSideMovies[idx]
        leftStatsValue = parseFloat(leftStats.dataset.value)
        rightStatsValue = parseFloat(rightStats.dataset.value)
        console.log(leftStatsValue, rightStatsValue)
        if (rightStatsValue > leftStatsValue){
            leftStats.classList.remove('is-primary')
            leftStats.classList.add('is-danger')
        }
        else if (leftStatsValue > rightStatsValue ){
            rightStats.classList.remove('is-primary')
            rightStats.classList.add('is-danger')
        }else if (rightStatsValue === leftStatsValue){
            rightStats.classList.remove('is-danger')
            leftStats.classList.remove('is-danger')
            rightStats.classList.add('is-primary')
            leftStats.classList.add('is-primary')
        }
    });
}

const checkData = (data) => {
    if (data && data !== 'N/A'){
        return parseFloat(data.replace(/\$/g, '').replace(/,/g, ''));
    }
    else{
        return 0;
    }
}
const checkTemplateData = (data) => {
    if (!data){
        return 'N/A';
    }
    return data
}

const movieTemplate = (movie) => {
    const boxOffice = checkData(movie.BoxOffice)
    const metascore = checkData(movie.Metascore);
    const imdbRating = checkData(movie.imdbRating);
    const imdbVotes = checkData(movie.imdbVotes.replace(/,/g, ''));
    const awards = movie.Awards.split(' ').reduce((prev, curr) => {
        const val = parseInt(curr)
        if (isNaN(val)){
            return prev;
        }
        else{
            return prev + val
        }
    }, 0)
    // console.log(boxOffice, metascore, imdbRating, imdbVotes, awards)
    return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movie.Poster}" >
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movie.Title}</h1>
          <h4>${movie.Genre}</h4>
          <p>${movie.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${awards}" class="notification is-primary">
      <p class="title">${checkTemplateData(movie.Awards)}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value="${boxOffice}" class="notification is-primary">
      <p class="title">${checkTemplateData(movie.BoxOffice)}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
      <p class="title">${checkTemplateData(movie.Metascore)}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
      <p class="title">${checkTemplateData(movie.imdbRating)}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
      <p class="title">${checkTemplateData(movie.imdbVotes)}</p>
      <p class="subtitle">IMBD Votes</p>
    </article>
    `
}



