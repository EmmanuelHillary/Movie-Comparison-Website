const createAutocomplete = ({autocomplete, renderOption, onOptionSelect, inputValue, fetchData}) => {
    autocomplete.innerHTML = `
        <label><b>Make a search</b></label>
        <br />
        <input type="text" class="input">
        <div class="dropdown">
            <div class="dropdown-menu" >
                <div class="dropdown-content results">
                </div>
            </div>
        </div>
    `
    const dropdown = autocomplete.querySelector('.dropdown')
    const results = autocomplete.querySelector('.results')
    const input = autocomplete.querySelector('.input')


    const onInput = async (e) => {
        const items = await fetchData(e.target.value);
        if (!items.length){
            dropdown.classList.remove('is-active');
            return;
        }
        dropdown.classList.add('is-active')
        results.innerHTML = ''  
        for(let item of items){
            const option = document.createElement('a')
            option.classList.add('dropdown-item')
            
            option.innerHTML = renderOption(item)
           option.addEventListener('click', ()=>{
               input.value = inputValue(item);
               dropdown.classList.remove('is-active');
               onOptionSelect(item);
           })
           results.appendChild(option)
        }
    }
    input.addEventListener('input', debounce(onInput))
    input.addEventListener('click', debounce(onInput))
    document.addEventListener('click', (event)=>{
        if (!autocomplete.contains(event.target)){
            dropdown.classList.remove('is-active')
        }
    })
}