import axios from "axios";
import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { mapVetDetails } from "../utils";
import { VetEditUrls } from "../context/vetApi";





const VetDetailsContext = createContext(null)


export const VetDetailsContextProvider = function({children}) {

    const [vetDetails, setVetDetails] = useState({});


    function updateVetDetails(newDetails) {
        setVetDetails(newDetails)
    }
    const fetchVetDetails = async (vetId) => {
        try {
          const { data } = await axios.get(VetEditUrls.info(vetId));
          const mapedVetDetails = mapVetDetails(data);
          setVetDetails(mapedVetDetails);
        //  setSelectedImage(mapVetDetails.profilePicture);
        } catch (e) {
          Alert.alert(e.message);
        }
      };


    return <VetDetailsContext.Provider value={{updateVetDetails, vetDetails, fetchVetDetails}}>
        {children}
    </VetDetailsContext.Provider>
}



export const useVetPage = () => {

    const context = useContext(VetDetailsContext)
    if(!context) {
        throw new Error("Vet context not provided")
    }
    return context
}