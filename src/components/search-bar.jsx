
export function SearchBar({setFilter}) {
    return (
        <div className="search-bar">
            <input type="text" placeholder="🔎︎ Search" onChange={(e) => {setFilter(e.target.value)}}/>
        </div>
    )
}