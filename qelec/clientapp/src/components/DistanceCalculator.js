export const haversineDistance = (coords1, coords2) => {
    // Validate coordinates
    if (
        !coords1 ||
        !coords2 ||
        typeof coords1.lat !== 'number' ||
        typeof coords1.lon !== 'number' ||
        typeof coords2.lat !== 'number' ||
        typeof coords2.lon !== 'number'
    ) {
        console.error("Invalid coordinates for distance calculation", { coords1, coords2 });
        throw new Error("Invalid coordinates for distance calculation");
    }

    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(coords2.lat - coords1.lat);
    const dLon = toRadians(coords2.lon - coords1.lon);
    const lat1 = toRadians(coords1.lat);
    const lat2 = toRadians(coords2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInKm = R * c;
    const distanceInMiles = distanceInKm * 0.621371; // Convert km to miles
    return distanceInMiles;
};
