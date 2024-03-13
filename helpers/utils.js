export function convertMinutesToHours(minutes) {
    // Calculate hours by dividing minutes by 60
    let hours = minutes / 60;
    // Return the result
    console.log(hours.toFixed(3)," returning hour conversion of ",minutes)
    return hours.toFixed(3); // Round to 3 decimal place
}