(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
})()

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('theme-icon');
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
}

// Tax toggle — must be global for onclick to work
function toggleTax() {
  const checkbox = document.getElementById('flexSwitchCheckDefault');
  const prices = document.querySelectorAll('.card-price');
  const gstLabels = document.querySelectorAll('.gst-label');

  prices.forEach(price => {
    const base = parseFloat(price.dataset.base);
    const strong = price.querySelector('strong');
    if (checkbox.checked) {
      strong.textContent = '₹' + Math.round(base * 1.18).toLocaleString('en-IN');
    } else {
      strong.textContent = '₹' + base.toLocaleString('en-IN');
    }
  });

  gstLabels.forEach(label => {
    label.style.display = checkbox.checked ? 'inline' : 'none';
  });
}


window.addEventListener('DOMContentLoaded', () => {
  // Theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.classList.replace('fa-moon', 'fa-sun');
  }

  // Filter active state
  document.querySelectorAll('.filter').forEach(filter => {
    filter.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
    });
  });

  // More filters toggle
  const moreBtn = document.getElementById('more-btn');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      const extra = document.getElementById('extra-filters');
      const icon = moreBtn.querySelector('i');
      const text = moreBtn.querySelector('p');

      if (extra.style.display === 'none' || extra.style.display === '') {
        extra.style.display = 'flex';
        icon.className = 'fa-solid fa-ellipsis-vertical';
        text.textContent = 'Less';
      } else {
        extra.style.display = 'none';
        icon.className = 'fa-solid fa-ellipsis';
        text.textContent = 'More';
      }
    });
  }

});