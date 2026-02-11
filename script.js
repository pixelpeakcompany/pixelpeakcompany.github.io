document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Dynamic Background Glow ---
    const glow = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        // Moves the radial gradient background with the mouse
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // --- 2. 3D Tilt Effect ---
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse x position within the element
            const y = e.clientY - rect.top;  // Mouse y position within the element
            
            // Calculate rotation (center of card is 0,0)
            // Max rotation is roughly 15 degrees
            const xCenter = rect.width / 2;
            const yCenter = rect.height / 2;
            
            const rotateX = ((y - yCenter) / yCenter) * -10; // Rotate X axis based on Y movement
            const rotateY = ((x - xCenter) / xCenter) * 10;  // Rotate Y axis based on X movement

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset card when mouse leaves
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
});
