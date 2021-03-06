import React, { Component } from 'react';
import CardProducts from '../components/CardProducts';
import CategoriesList from '../components/CategoriesList';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';
import '../styles/MainPage.css';

export default class MainPage extends Component {
  state = {
    loading: false,
    loaded: false,
    search: '',
    listCategories: [],
    listProducts: [],
    waiting: true,
    categoryId: '',
    headerFunc: '',
  }

  async componentDidMount() {
    const list = await getCategories();
    this.setState({ listCategories: list });
  }

  getHeaderState = (func) => {
    this.setState({ headerFunc: func });
  }

  handleInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  handleClick = (idCategory) => {
    this.setState({ categoryId: idCategory, loading: true, waiting: false }, async () => {
      const getProducts = await getProductsFromCategoryAndQuery(idCategory, '');
      this.setState({ listProducts: getProducts, loading: false, loaded: true, search: '',
      });
    });
  }

  searchClick = () => {
    const { categoryId, search } = this.state;
    this.setState({ loading: true, waiting: false }, async () => {
      const getProducts = await getProductsFromCategoryAndQuery(categoryId, search);
      this.setState({ listProducts: getProducts, loading: false, loaded: true,
      });
    });
  }

  render() {
    const { loading, loaded, waiting, search, listCategories, listProducts, headerFunc,
    } = this.state;
    return (
      <div>
        <Header getHeaderState={ this.getHeaderState } />
        <div className="input-search">
          <input
            data-testid="query-input"
            name="search"
            type="text"
            value={ search }
            onChange={ this.handleInputChange }
          />
          <button
            data-testid="query-button"
            type="button"
            onClick={ this.searchClick }
          >
            Pesquisar
          </button>
        </div>
        <hr />
        <div className="categories-products">
          <section className="categories-container">
            { listCategories.map((item) => (
              <CategoriesList
                handleClick={ this.handleClick }
                key={ item.id }
                idCategory={ item.id }
                categorieName={ item.name }
              />))}
          </section>
          <section className="products-container">
            { loading && <Loading /> }
            { loaded && listProducts.results.map((product) => (
              <CardProducts
                key={ product.id }
                product={ product }
                headerFunc={ headerFunc }
              />))}
            { waiting && (
              <p data-testid="home-initial-message">
                Digite algum termo de pesquisa ou escolha uma categoria.
              </p>) }
          </section>
        </div>
      </div>
    );
  }
}
