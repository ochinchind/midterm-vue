export function getStarStyle(rating: any) {
    let startColor;
    if (rating <= 1) {
    startColor = '#ff0000';
    } else if (rating <= 2) {
    startColor = '#ff6f00';
    } else if (rating <= 3) {
    startColor = '#ffb904'; 
    } else if (rating <= 4) {
    startColor = '#ffe234'; 
    } else {
    startColor = '#ffff00'; 
    }

    const percentage = (rating * 100) / 5; 

    return {
    background: `linear-gradient(90deg, ${startColor} 0%, ${startColor} ${percentage}%, #e4e4e4 ${percentage}%, #e4e4e4 100%)`,
    '-webkit-background-clip': 'text',
    'color': 'transparent',
    };
}