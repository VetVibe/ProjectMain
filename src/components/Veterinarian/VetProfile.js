import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, useWindowDimensions, SafeAreaView, ScrollView, Switch, StyleSheet} from 'react-native';
import { COLORS, FONTS, SIZES, images } from '../../constants';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";


export function VetProfile({ route }) {

    const navigation = useNavigation();
    const [vetDetails, setVetDetails] = useState({});
    const [isAvailable, setIsAvailable] = useState(false);

    const vetId = route.params.vetId;

    useEffect(() => {
        axios
          .get(`http://10.0.2.2:3000/veterinarian/${vetId}`)
          .then((response) => {
            const mapedPetDetails = mapPetDetails(response.data);
            setPetDetails(mapedVetDetails);
          })
          .catch((error) => {
            console.error("Error fetching vet details:", error);
          });
      }, [vetId]);
    
    const toggleSwitch = () => setIsAvailable(previousState => !previousState);

    const EditVetProfileClick = () => {
      navigation.navigate("Edit Vet Profile", { vetId: vetId });
    };

     const ShareTipClick = () => {
        navigation.navigate("Share Tip", { vetId: vetId });
    };

    const ViewProfileClick = () => {
        navigation.navigate("View Vet Profile", { vetId: vetId });
    };

    // Replace these values with actual data
    const phoneNumber = '053-4324453';
    const vetRating = '4.8/5';
    const clientsCount = '+200';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <StatusBar backgroundColor={COLORS.gray} />
        <ScrollView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity 
                style={{
                    position: 'absolute',
                    left: 20,
                    top: 20,
                    zIndex: 1,
                    width: 36,
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.primary,
                    borderRadius: 10,
                }}
                    onPress={ViewProfileClick}
                >
                <MaterialIcons name='remove-red-eye' size={24} color={COLORS.white} />
             </TouchableOpacity>
                {/* Edit Profile Button */}
                <TouchableOpacity 
                    style={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        zIndex: 1,
                        width: 36,
                        height: 36,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                    }}
                    onPress={EditVetProfileClick}
                >
                    <MaterialIcons name='edit' size={24} color={COLORS.white} />
            </TouchableOpacity>
              <TouchableOpacity 
                style={{
                    position: 'absolute',
                    right: 20,
                    top: 20,
                    zIndex: 1,
                    width: 36, // Adjust the width to your preference
                    height: 36, // Adjust the height to your preference
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.primary,
                    borderRadius: 10,
                }}
                onPress={EditVetProfileClick}
            >
                <MaterialIcons name='edit' size={24} color={COLORS.white} />
            </TouchableOpacity>

                <Image
                    source={images.Vetprofile}
                    resizeMode='contain'
                    style={{
                        height: 155,
                        width: 155,
                        borderRadius: 20,
                        borderColor: COLORS.primary,
                        borderWidth: 2,
                        marginTop: 80,
                    }}
                />

                <Text style={{ ...FONTS.h2, color: COLORS.primary, marginVertical: 8 }}>
                    Dr. Sarah Smith
                </Text>
                <Text style={{ color: COLORS.black, ...FONTS.body4 }}>
                    Veterinarian, Animal Care
                </Text>

                <View style={{ flexDirection: 'row', marginVertical: 6, alignItems: 'center' }}>
                    <MaterialIcons name='location-on' size={24} color='black' />
                    <Text style={{ ...FONTS.body4, marginLeft: 4 }}>
                        Hadera, Israel
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', marginVertical: 6, alignItems: 'center' }}>
                    <MaterialIcons name='phone' size={24} color='black' />
                    <Text style={{ ...FONTS.body4, marginLeft: 4 }}>
                        {phoneNumber}
                    </Text>
                </View>

                <View style={{ paddingVertical: 8, flexDirection: 'row' }}>
                        <View style={styles.infoBox}>
                            <Text style={{ ...FONTS.h3, color: 'black' }}>
                                {'4.8/5'} {/* Replace with actual rating */}
                            </Text>
                            <Text style={{ ...FONTS.body4, color: 'black' }}>
                                Rating
                            </Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={{ ...FONTS.h3, color: 'black' }}>
                                {'+200'} {/* Replace with actual clients count */}
                            </Text>
                            <Text style={{ ...FONTS.body4, color: 'black' }}>
                                Clients
                            </Text>
                        </View>
                </View>

                {/* About Section */}
                <View style={{ width: '100%', paddingHorizontal: SIZES.padding }}>
                    <Text style={{ 
                        ...FONTS.h2, 
                        color: COLORS.black, 
                        textAlign: 'left',
                        marginTop: 15 
                    }}>
                        About
                    </Text>

                    <Text style={{ 
                        ...FONTS.body4, 
                        color: COLORS.darkgray,
                        textAlign: 'left',
                        marginTop: 10 
                    }}>
                        {/* Replace this with the actual description */}
                        Dr. Sarah Smith is a compassionate and dedicated veterinarian with over a decade of experience in animal healthcare. Renowned for her expertise in small animal surgery and preventive care, she is deeply committed to enhancing the well-being of pets. Sarah's approach combines the latest veterinary practices with a warm, personal touch, ensuring both animals and their owners feel comfortable and cared for. Her love for animals extends beyond her clinic, as she is actively involved in community animal welfare programs.
                    </Text>
                </View>

                <TouchableOpacity 
                    style={{
                        width: '90%',
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.primary,
                        borderRadius: 10,
                        marginBottom: 20,
                        marginTop: 20,
                    }}
                    onPress={ShareTipClick}
                >
                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>
                        Share Tips
                    </Text>
                </TouchableOpacity>

                {/* Availability Switch */}
                <View style={styles.availabilityContainer}>
                    <Text style={{ ...FONTS.h4, color: COLORS.black, marginRight: 10 }}>
                        {isAvailable ? 'Available' : 'Unavailable'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#FFA500" }}
                        thumbColor={isAvailable ? "#FFFFFF" : "#FFFFFF"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isAvailable}
                    />
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '90%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        marginBottom: 20,
    },
    availabilityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: 40,
        padding: 10,
        marginVertical: 20,
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
    },
    infoBox: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: SIZES.padding,
        backgroundColor: COLORS.gray,
        borderRadius: 10,
        padding: 10,
    },
});

export default VetProfile;
