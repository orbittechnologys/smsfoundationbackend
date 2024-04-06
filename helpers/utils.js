export function convertMinutesToHours(minutes) {
    // Calculate hours by dividing minutes by 60
    let hours = minutes / 60;
    // Return the result
    console.log(hours.toFixed(3)," returning hour conversion of ",minutes)
    return hours.toFixed(3); // Round to 3 decimal place
}

export function getPercentage(num,denom){
    if (denom === 0) {
        return 0; // Avoid division by zero
      }
      const percentage = (num / denom) * 100;
      return Math.round(percentage * 100) / 100;
}