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
  // Password Reset Variables
let resetVerificationCode = null;
let resetEmail = null;

// Forgot Password Link
document.getElementById('forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('password-reset-modal').style.display = 'block';
});

// Reset Request Form
document.getElementById('reset-request-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    resetEmail = document.getElementById('reset-email').value;
    
    // Generate and send code
    resetVerificationCode = Math.floor(100000 + Math.random() * 900000);
    
    try {
        // Show loading state
        showResetStatus('Sending verification code...', 'status-loading');
        
        await emailjs.send('service_j3r9dle', 'template_default', {
            to_email: resetEmail,
            verification_code: resetVerificationCode,
            user_name: 'Valued Customer',
            from_name: "FreshMart Team",
            message: 'Your password reset code is:'
        });
        
        document.getElementById('reset-step1').style.display = 'none';
        document.getElementById('reset-step2').style.display = 'block';
        showResetStatus('Verification code sent!', 'status-success');
    } catch (error) {
        showResetStatus('Error sending email: ' + error.message, 'status-error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Code';
    }
});

// Reset Confirm Form
document.getElementById('reset-confirm-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    const enteredCode = document.getElementById('reset-code').value;
    const newPassword = document.getElementById('new-password').value;
    
    showResetStatus('Verifying code...', 'status-loading');
    
    if (enteredCode == resetVerificationCode) {
        // In a real app, you would save the new password to your database here
        showResetStatus('Password reset successful! You can now login with your new password.', 'status-success');
        
        // Close modal after 3 seconds
        setTimeout(() => {
            document.getElementById('password-reset-modal').style.display = 'none';
            document.getElementById('reset-step1').style.display = 'block';
            document.getElementById('reset-step2').style.display = 'none';
            document.getElementById('reset-request-form').reset();
            document.getElementById('reset-confirm-form').reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Reset Password';
        }, 3000);
    } else {
        showResetStatus('Invalid verification code', 'status-error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
    }
});

// Helper function for reset status messages
function showResetStatus(message, type) {
    const statusElement = document.getElementById('reset-status');
    statusElement.textContent = message;
    statusElement.className = type;
    statusElement.style.display = 'block';
}
});

