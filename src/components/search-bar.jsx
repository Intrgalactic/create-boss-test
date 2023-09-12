import { debounce } from "src/utils/utilities";

export function SearchBar({setFilter}) {
    function filterFields(e) {

            setFilter(e.target.value);
      
    }
    return (
        <div className="search-bar">
            <input type="text" placeholder="🔎︎ Search" onChange={filterFields}/>
        </div>
    )
}