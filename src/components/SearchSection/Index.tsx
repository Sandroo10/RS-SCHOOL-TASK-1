import { Component } from "react";

export class SearchSection extends Component {
    render() {
        return (
            <section className="searchSection">
                <h1>Search Section</h1>
                <form className="searchForm">
                    <input type="text" placeholder="Search..." className="searchInput"/>
                    <button type="submit" className="submitButton">Search</button>
                </form>
            </section>
        );
    }
}