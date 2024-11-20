const axios = require('axios')
//Current location
exports.getCurrentLocationByLatLng = async (req, res) => {
    const { lat, lng } = req.body;

    // Check if latitude and longitude are provided
    if (!lat || !lng) {
        return res.status(400).json({
            success: false,
            message: "Latitude and longitude are required",
        });
    }

    try {
        // Check if the Google Maps API key is present
        if (!process.env.GOOGLE_MAP_KEY) {
            return res.status(403).json({
                success: false,
                message: "API Key is not found"
            });
        }

        // Fetch address details using the provided latitude and longitude
        const addressResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAP_KEY}`
        );
        
        // Check if any results are returned
        if (addressResponse.data.results.length > 0) {
            const addressComponents = addressResponse.data.results[0].address_components;
            // console.log(addressComponents)
   
            let city = null;
            let area = null;
            let postalCode = null;
            let district = null;

            // Extract necessary address components
            addressComponents.forEach(component => {
                if (component.types.includes('locality')) {
                    city = component.long_name; 
                } else if (component.types.includes('sublocality_level_1')) {
                    area = component.long_name; 
                } else if (component.types.includes('postal_code')) {
                    postalCode = component.long_name; 
                } else if (component.types.includes('administrative_area_level_3')) {
                    district = component.long_name; // Get district
                }
            });

            // Prepare the address details object
            const addressDetails = {
                completeAddress: addressResponse.data.results[0].formatted_address,
                city: city,
                area: area,
                district: district,
                postalCode: postalCode,
                landmark: null, // Placeholder for landmark if needed
                lat: addressResponse.data.results[0].geometry.location.lat,
                lng: addressResponse.data.results[0].geometry.location.lng,
            };

            console.log("Address Details:", addressDetails);

            // Respond with the location and address details
            return res.status(200).json({
                success: true,
                data: {
                    location: { lat, lng },
                    address: addressDetails,
                },
                message: "Location fetch successful"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No address found for the given location",
            });
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch address",
        });
    }
}

//geocode =====================================================
exports.getLatLngByAddress = async (req, res) => {
    const { address } = req.query; 

    if (!address) {
        return res.status(400).send({ error: 'Address is required' });
    }

    try {
        // console.log(process.env.GOOGLE_MAP_KEY)
        // Make a request to Google Geocoding API
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: "AIzaSyCBATa-tKn2Ebm1VbQ5BU8VOqda2nzkoTU"
            },
        });
        console.log(response.data)
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            const lat = location.lat;
            const lng = location.lng;

            // Send the lat and lng back to the client
            res.json({
                latitude: lat,
                longitude: lng,
                formatted_address: response.data.results[0].formatted_address,
            });
        } else {
            res.status(404).json({ error: 'No results found for the provided address' });
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        res.status(500).send({ error: 'Server error' });
    }
}

//autocomplete ===========================================
exports.AutoCompleteAddress = async (req, res) => {
    try {
        const { input } = req.query;
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
            {
                params: {
                    input,
                    radius: 500,
                    key: process.env.GOOGLE_MAP_KEY
                }
            }
        );
        res.json(response.data.predictions);
    } catch (error) {
        console.error('Error making Google API request:', error);
        res.status(500).send('Server error');
    }
}
