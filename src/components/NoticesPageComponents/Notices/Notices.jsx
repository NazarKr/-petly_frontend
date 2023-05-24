import NoticesSearch from "../NoticesSearch/NoticesSearch";
import NoticesFilters from "../NoticesFilters/NoticesFilters";
import NoticesCategoriesNav from "../NoticesCategoriesNav/NoticesCategoriesNav";
import NoticesCategoriesList from "../NoticesCategoriesList/NoticesCategoriesList";
import AddPetButton from "../AddPetButton/AddPetButton";
import NoticesTitle from "../NoticesTitle/NoticesTitle";
import ModalNotice from "../ModalNotice/ModalNotice";
import NoticesPaginationButtons from "../NoticesPaginationButtons/NoticesPaginationButtons";
import { NoticesContainer, NoticesContentBox, NoticesNavBox } from "../NoticesContainers/NoticesContainers.styled";

import { searchNoticesByName, searchNoticesByCategory } from "../../../services/noticesApi";
import { getIsLoggedIn, getUser } from "../../../redux/auth/authSelectors";

import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';

import { getNoticesByPrivateCategory } from '../../../redux/notices/noticesOperations';
import { getNotices } from "../../../redux/notices/noticesSelectors";

const NoticesPage = () => {
    const { categoryName } = useParams();

    let isLoggedIn = useSelector(getIsLoggedIn);
    let user = useSelector(getUser);
  
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState(null);
    const [query, setQuery] = useState('');
    const [notices, setNotices] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isWideScreen, setIsWideScreen] = useState(false);
    const [limit, setLimit] = useState("10");
    const [category, setCategory] = useState("sell");

    const dispatch = useDispatch();

    useEffect(() => {
        switch (categoryName) {
            case "sell":
                setCategory("sell");
                break;
            case "lost-found":
                setCategory("lostFound");
                break;
            case "for-free":
                setCategory("inGoodHands");
                break;
            case "favorite":
                setCategory("favorite");
                break;
            case "own":
                setCategory("created");
                break;
            default:
                setCategory(null);
        }
    }, [categoryName])

    useEffect(() => {
        const resizeHandler = () => {
            setIsWideScreen(window.innerWidth > 1280);
        };

        resizeHandler();
        if (isWideScreen) {
            setLimit("12");
        } else {
            setLimit("10");
        }

        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, [isWideScreen]);


    const searchNotices = (query) => {
        setQuery(query);
    }

    useEffect(() => {
        const fetchNoticesByName = async (category, query, page, limit) => {
            try {
                const response = await searchNoticesByName(category, query, page, limit);
                setNotices(response.data);
                setTotalPages(response.totalPages);
            }
            catch (error) {
                alert(error.message);
            }
        }
        if (query !== '') {
            fetchNoticesByName(category, query, page, limit);
        }
    }, [query, category, page, limit]);

    useEffect(() => {
        const fetchNoticesByCategory = async () => {
            try {
                if (category === "sell" || category === "lostFound" || category === "inGoodHands") {
                    const response = await searchNoticesByCategory(category, page, limit);
                    setNotices(response.data);
                    setTotalPages(response.totalPages);
                }
                if (category === "favorite" || category === "created") {
                    const response = await dispatch(getNoticesByPrivateCategory({ category, page, limit }));
                    if (response.type === "/getNoticesByPrivateCategory/fulfilled") {
                        setNotices(response.payload);
                        setTotalPages(4); 
                    } else {
                        setNotices([]);
                    }
                }
            }
            catch (error) {
                alert(error.message);
            }
        }
        fetchNoticesByCategory();
    }, [category, page, limit]);

    const openModal = (data) => {
        setIsModalOpen(true);
        setModalInfo({ ...data});
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalInfo(null);
    };

    return <main>
        <NoticesContainer>
                <NoticesContentBox>
                <NoticesTitle />
                <NoticesSearch onSubmit={searchNotices} />
                <NoticesNavBox>
                    <NoticesCategoriesNav isLoggedIn={isLoggedIn} />
                    <AddPetButton isAuth={isLoggedIn} />
                </NoticesNavBox>
                <NoticesCategoriesList items={notices} openModal={openModal} user={user} isLoggedIn={isLoggedIn} />
                <NoticesPaginationButtons currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
                {isModalOpen && <ModalNotice
                    close={closeModal}
                    details={modalInfo}
                    isLoggedIn={isLoggedIn}
                    user={user}
                />}
            </NoticesContentBox>
        </NoticesContainer>
            
    </main>;
}

export default NoticesPage;