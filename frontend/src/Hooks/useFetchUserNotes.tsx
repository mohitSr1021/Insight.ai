import { useEffect } from "react";
import { fetchNotes } from "../redux/api/noteAPI";
import { useAppDispatch } from "../redux/store/rootStore";

const useFetchUserNotes = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchUserNotes = async () => {
            try {
                const storedDetails = localStorage.getItem("userDetails");
                if (!storedDetails) return;

                const { userId } = JSON.parse(storedDetails);
                if (userId) {
                    await dispatch(fetchNotes(userId));
                }
            } catch (err) {
                console.error("Error fetching notes:", err);
            }
        };

        fetchUserNotes();
    }, [dispatch]);
};

export default useFetchUserNotes;
