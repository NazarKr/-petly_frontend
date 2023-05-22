import { useState, useEffect } from 'react';
// import './App.css';
import { useSearchParams } from 'react-router-dom';
import NewsCard from './NewsCard';
import getNews from '../../utils/getNews.js';

import { TitleStyled } from '../../components/Title/Title.styled.js';
import { NewsCardContainer } from '../../components/News/News.styled.js';
import Pagination from '../../components/common/Pagination';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);

  console.log(page);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';
  const [search, setSearch] = useState(query);

  const fetchNews = async searchKeyword => {
    try {
      const news = await getNews(searchKeyword);
      const result = news.data;
      setNews(result);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleInputChange = evt => {
    setSearchParams({ query: evt.currentTarget.value.toLowerCase().trim() });
    setSearch(evt.currentTarget.value.toLowerCase());
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    fetchNews(search);
    // console.log('Search keyword:', searchKeyword);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  // console.log();
  return (
    <>
      <TitleStyled>News</TitleStyled>
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="query"
            placeholder="Search news..."
            value={search}
            onChange={handleInputChange}
          />
        </form>
        {/*{search && (*/}
        {/*  <button className="clear-search-button" onClick={handleClearSearch}>*/}
        {/*    <i className="fa fa-times" aria-hidden="true"></i>*/}
        {/*  </button>*/}
        {/*)}*/}
        {/*<button className="search-button" onClick={handleSubmit}>*/}
        {/*  <i className="fa fa-search" aria-hidden="true"></i>*/}
        {/*</button>*/}
      </div>
      <NewsCardContainer className="news-container">
        {news.map(newsItem => (
          <NewsCard key={newsItem.id} news={newsItem} />
        ))}
      </NewsCardContainer>
      {/*{search !== '' && query && news.length === 0 && (*/}
      {/*    <p>not found</p>*/}
      {/*)}*/}

      <Pagination
        setPage={setPage}
        page={page}
        count={news.length}
        mt={20}
        mb={20}
      />
    </>
  );
};

export default NewsList;