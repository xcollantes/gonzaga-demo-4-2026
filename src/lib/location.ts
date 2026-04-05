import { profileApiUrl } from "@/lib/api-urls";
import { getCurrentUserToken } from "@/lib/firebase-init";

interface Location {
  latitude: number;
  longitude: number;
  ipAddress?: string;
  country?: string;
  region?: string;
  city?: string;
  zip?: string;
  timezone?: string;
  isp?: string;
  org?: string;
}

/**
 * Get user location data with fallback support.
 *
 * Returns IP address and location data.
 * Tries multiple APIs in order until one succeeds.
 *
 * @returns UserLocationData
 */
export const getUserLocationData = async (): Promise<Location> => {
  // Define API providers with their response parsers.
  const apiProviders = [
    {
      name: "ipapi.co",
      url: "https://ipapi.co/json/",
      parser: (data: { latitude: number, longitude: number, ip: string, country_name: string, region: string, city: string, postal: string, utc_offset: number, timezone: string }) => ({
        latitude: data.latitude,
        longitude: data.longitude,
        ipAddress: data.ip,
        country: data.country_name,
        region: data.region,
        city: data.city,
        zip: data.postal,
        timezone: data.timezone,
      })
    },
    {
      name: "ip-api.com",
      url: "http://ip-api.com/json/",
      parser: (data: { lat: number, lon: number, query: string, country: string, regionName: string, city: string, zip: string, timezone: string }) => ({
        latitude: data.lat,
        longitude: data.lon,
        ipAddress: data.query,
        country: data.country,
        region: data.regionName,
        city: data.city,
        zip: data.zip,
        timezone: data.timezone,
      })
    },
    {
      name: "ipinfo.io",
      url: "https://ipinfo.io/json",
      parser: (data: { loc: string, ip: string, country: string, region: string, city: string, postal: string, timezone: string }) => {
        const [lat, lon] = (data.loc || "0,0").split(",");
        return {
          latitude: parseFloat(lat) || 0,
          longitude: parseFloat(lon) || 0,
          ipAddress: data.ip,
          country: data.country,
          region: data.region,
          city: data.city,
          zip: data.postal,
          timezone: data.timezone,
        };
      }
    },
    {
      name: "ipgeolocation.io",
      url: "https://api.ipgeolocation.io/ipgeo?apiKey=",
      parser: (data: { latitude: string, longitude: string, ip: string, country_name: string, state_prov: string, city: string, zipcode: string, time_zone: { name: string }, timezone: string }) => ({
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        ipAddress: data.ip,
        country: data.country_name,
        region: data.state_prov,
        city: data.city,
        zip: data.zipcode,
        timezone: data.time_zone?.name || data.timezone,
      })
    }
  ];

  // Try each API provider in order.
  for (const provider of apiProviders) {
    try {
      console.log(`Trying ${provider.name}...`);

      const response = await fetch(provider.url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        // Add timeout to prevent hanging.
        signal: AbortSignal.timeout(10000) // 10 second timeout.
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`${provider.name} response:`, data);

      // Check if response contains error.
      if (data.error || data.status === "fail") {
        throw new Error(data.message || data.error || "API returned error status");
      }

      // Parse the response using the provider's parser.
      const locationData = provider.parser(data);

      // Validate that we have essential data.
      if (!locationData.ipAddress || (!locationData.latitude && !locationData.longitude)) {
        throw new Error("Invalid response: missing essential location data");
      }

      console.log(`Successfully got location data from ${provider.name}`);
      return locationData;

    } catch (err) {
      console.warn(`${provider.name} failed:`, err);
      // Continue to next provider.
    }
  }

  // All providers failed.
  console.error("All IP geolocation providers failed");
  return {
    latitude: 0,
    longitude: 0,
    ipAddress: "",
    country: "",
    region: "",
  };
}

/**
 * Update user location in Firestore profile via backend.
 *
 * This is called when user logs in and when they update their location.
 */
export const updateLocationInProfile = async () => {
  if (!navigator.geolocation) {
    console.warn("Geolocation is not supported by this browser.");
    return;
  }

  // Get IP address and location.
  // There are 2 ways to get the IP address:
  //
  // METHOD 1: Use the IP address and run through ip-api.com.
  // METHOD 2: Use the IP address from the user's device using navigator.geolocation.
  //
  // See more: https://faxion.atlassian.net/browse/WEBAPP-21

  // METHOD 1:
  try {
    const locResponse = await getUserLocationData();

    if (locResponse) {
      console.log(locResponse);
      await updateLocation(locResponse);
    }

    // const ipData = await fetch("https://api.ipify.org?format=json");
    // const ipResponse = await ipData.json();
    // console.log(ipResponse);

    // const ipLocation = await fetch(`http://ip-api.com/json/${ipResponse.ip}`);
    // const locResponse = await ipLocation.json();
    // console.log(locResponse);

    // locResponse.ipAddress = ipResponse.ip;


  } catch (err) {
    console.error("Failed to get IP address and location:", err);
  }

  // METHOD 2:
  // getCurrentPosition() will prompt user for permission.
  // navigator.geolocation.getCurrentPosition(
  //   async (position) => {
  //     const { latitude, longitude } = position.coords;
  //     console.log(`Location obtained: ${latitude}, ${longitude}`);
  //     await updateLocation({
  //       latitude,
  //       longitude,
  //     });
  //   },
  //   (geoError) => {
  //     console.warn(`Geolocation error: ${geoError.message}`);
  //   }
  // );
};

/**
 * Update user location in Firestore profile via backend.
 *
 * This is called when user logs in and when they update their location.
 */
async function updateLocation(location: Location) {
  console.log("Checking if profile exists before updating location.", {
    location,
  });

  try {
    const token = await getCurrentUserToken();

    // First check if profile exists
    const profileResponse = await fetch(profileApiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!profileResponse.ok) {
      console.info("Profile does not exist, skipping location update.");
      return;
    }

    const profileData = await profileResponse.json();
    if (!profileData.result.profile || Object.keys(profileData.result.profile).length <= 0) {
      console.info("Profile exists but is empty, skipping location update.");
      return;
    }

    console.log("Profile exists, proceeding with location update.");

    const response = await fetch(profileApiUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location: location,
        ipAddress: location.ipAddress,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend profile update failed:", errorData);
      throw new Error(errorData.message || "Failed to update location in profile");
    }

    console.log("User location updated in profile via backend.", {
      location,
      response: await response.json()
    });

  } catch (err) {
    const updateError = err as Error;
    console.error("Failed to update location in profile:", updateError);
    // toast({
    //   title: "Location Update Failed",
    //   description: updateError.message || "Could not update your location.",
    //   variant: "destructive"
    // });
  }
}
