import {  Modal, View } from 'react-native';
import { Button } from "react-native-elements";
import React, { useState, useEffect , useMemo} from "react";
import { Text, Image, TouchableOpacity, SafeAreaView, ScrollView, Switch, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONTS, SIZES } from "../../constants";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { mapVetDetails } from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Rating from "../../components/Rating/Rating";
import { clientServer } from "../../server";

import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function MakeAnAppointmentScreen({ route }) {   
    const [vetId, setVetId] = useState(null);
    const [userType, setUserType] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState()
    const [selectedHour, setSelectedHour] = useState()
    const [vetInfo, setVetInfo] = useState(null);

    const fetchVetInfo = async (vetId) => {
    try {
        // Assuming clientServer is your API client
        const vetId = (await AsyncStorage.getItem("vetId")) || route.params?.vetId;
        setVetId(vetId);
        const vetData = await clientServer.getVetInfo(vetId);
        setVetInfo(vetData);
    } catch (error) {
        console.log(error);
    }
    };



  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const type =
            (await AsyncStorage.getItem("userType")) || route.params?.userType;
          setUserType(type);
  
          const id = (await AsyncStorage.getItem("vetId")) || route.params?.vetId;
          setVetId(id || null);
  
          if (userType === "petOwner") {
            if (id) {
              fetchTipsById(id);
            } else {
              fetchAllTips();
            }
          } else if (userType === "vet") {
            fetchTipsById(id);
            fetchAllTips();
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }, [vetId]);





    useEffect(() => {
        const fetchVetDetails = async () => {
          try {
            const id = await AsyncStorage.getItem("vetId");
            setVetId(id);
            const data = await clientServer.getVetInfo(id);
            const mapedVetDetails = mapVetDetails(data);
            setVetDetails(mapedVetDetails);
            setSelectedImage(mapedVetDetails.profilePicture);
          } catch (error) {
            console.log(error);
          }
        };
        fetchVetDetails();
      }, [vetId]);


    useEffect(() => {
        if(selectedDate) {
            setDatePickerVisibility(true) // now its time to choose hour
        }
    }, [selectedDate])

    const handleSubmit = () => {

    }

    const isModalVisible = useMemo(() => {
        return selectedDate !== undefined && selectedHour!== undefined
    },[selectedDate, selectedHour])


    return <View>
            <Calendar 
                    onDayPress={day => {
                        setSelectedDate(day.dateString);
                }}
                />
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
            setSelectedDate(undefined)
            setSelectedHour(undefined)    
        }}>
            <View>
                <Text>Would you like to make an appointment with {veterinarianInfo.name} on {selectedDate} at {selectedHour}?</Text>
                <Button onPress={() => {
                     setSelectedDate(undefined)
                     setSelectedHour(undefined)    
                }}>Yes, Make appointment</Button>
                <Button onPress={() => {
                     setSelectedDate(undefined)
                     setSelectedHour(undefined)    
                }}>Cancel</Button>
            </View>
        </Modal>
        <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={(date) => setSelectedHour(date.getHours()) }
                onCancel={() => setSelectedDate(undefined)}
            />
    </View> 
    
   

}

