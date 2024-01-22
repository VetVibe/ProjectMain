import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions, SafeAreaView, ScrollView, Switch, StyleSheet} from 'react-native';
import { COLORS, FONTS, SIZES, images } from '../../constants';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ViewVetProfile = () => {
    const navigation = useNavigation();


    const RatingClick = () => {
        navigation.navigate("Rating");
    };

    const ClientClick = () => {
        navigation.navigate("Number Of Clients");
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

                <Image
                    source={images.Vetprofile}
                    resizeMode='contain'
                    style={{
                        height: 155,
                        width: 155,
                        borderRadius: 20,
                        borderColor: COLORS.primary,
                        borderWidth: 2,
                        marginTop: 20,
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
                    <TouchableOpacity style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginHorizontal: SIZES.padding,
                        backgroundColor: COLORS.gray,
                        borderRadius: 10,
                        padding: 10,
                    }}
                    onPress={RatingClick}
                    >
                        <Text style={{ ...FONTS.h3, color: 'black' }}>
                            {vetRating}
                        </Text>
                        <Text style={{ ...FONTS.body4, color: 'black' }}>
                            Rating
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginHorizontal: SIZES.padding,
                        backgroundColor: COLORS.gray,
                        borderRadius: 10,
                        padding: 10,
                    }}
                    onPress={ClientClick}
                    >
                        <Text style={{ ...FONTS.h3, color: 'black' }}>
                            {clientsCount}
                        </Text>
                        <Text style={{ ...FONTS.body4, color: 'black' }}>
                            Clients
                        </Text>
                    </TouchableOpacity>
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

            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default ViewVetProfile;
