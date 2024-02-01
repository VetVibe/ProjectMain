// import axios from "axios";
// import { createContext, useContext, useState } from "react";
// import { Alert } from "react-native";
// import { mapPetOwnerDetails } from "../utils";
// import { PetOwnerEditUrls } from "../context/PetOwnerApi";


// const PetOwnerDetailsContext = createContext(null)


// export const PetOwnerDetailsContextProvider = function({children}) {

//     const [PetOwnerDetails, setPetOwnerDetails] = useState({});


//     function updatePetOwnerDetails(newDetails) {
//         setPetOwnerDetails(newDetails)
//     }
//     const fetchPetOwnerDetails = async (petOwnerId) => {
//         try {
//           const { data } = await axios.get(PetOwnerEditUrls.info(petOwnerId));
//           const mapedPetOwnerDetails = mapPetOwnerDetails(data);
//           setPetOwnerDetails(mapedPetOwnerDetails);
//         //  setSelectedImage(mapPetOwnerDetails.profilePicture);
//         } catch (e) {
//           Alert.alert(e.message);
//         }
//       };


//     return <PetOwnerDetailsContext.Provider value={{updatePetOwnerDetails, PetOwnerDetails, fetchPetOwnerDetails}}>
//         {children}
//     </PetOwnerDetailsContext.Provider>
// }

// export const usePetOwnerPage = () => {

//     const context = useContext(PetOwnerDetailsContext)
//     if(!context) {
//         throw new Error("Pet Owner context not provided")
//     }
//     return context
// }