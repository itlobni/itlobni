// Sign Up Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get the modal and button elements
  const modal = document.getElementById('signupModal');
  const signupBtn = document.querySelector('.signup-icon'); // Adjust selector if needed
  const closeBtn = document.querySelector('.close');
  
  // Function to open modal
  function openModal() {
    modal.style.display = 'block';
  }
  
  // Function to close modal
  function closeModal() {
    modal.style.display = 'none';
  }
  
  // Event listeners
  if (signupBtn) {
    signupBtn.addEventListener('click', openModal);
  }
  
  closeBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Form submission
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      
      // Simple validation
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      
      // Here you would typically send the data to a server
      // For now, we'll just log it and show a success message
      console.log('Sign up data:', { username, email, password });
      
      alert('Sign up successful! (This is a demo. In a real app, data would be sent to a server.)');
      closeModal();
      
      // Reset form
      signupForm.reset();
    });
  }
});
