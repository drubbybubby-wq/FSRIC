// ---------- Mobile nav ----------
(function(){
  var toggle = document.querySelector('.nav-toggle');
  var mobile = document.querySelector('.nav-mobile');
  if(!toggle || !mobile) return;
  toggle.addEventListener('click', function(){
    var open = mobile.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  mobile.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      mobile.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    });
  });
})();

// ---------- Registration form ----------
(function(){
  var form = document.getElementById('register-form');
  if(!form) return;

  var membersWrap = document.getElementById('members-wrap');
  var addMemberBtn = document.getElementById('add-member');
  var memberCount = membersWrap.querySelectorAll('fieldset.member').length;
  var MAX_MEMBERS = 4;

  function refreshRemoveButtons(){
    var fieldsets = membersWrap.querySelectorAll('fieldset.member');
    fieldsets.forEach(function(fs, i){
      var btn = fs.querySelector('.member-remove');
      btn.style.display = fieldsets.length > 1 ? 'inline-block' : 'none';
      fs.querySelector('legend').textContent = 'Student ' + (i + 1);
    });
    addMemberBtn.disabled = fieldsets.length >= MAX_MEMBERS;
    addMemberBtn.style.opacity = fieldsets.length >= MAX_MEMBERS ? '0.5' : '1';
    addMemberBtn.textContent = fieldsets.length >= MAX_MEMBERS
      ? 'Maximum of 4 students per team'
      : '+ Add another student';
  }

  addMemberBtn.addEventListener('click', function(){
    var fieldsets = membersWrap.querySelectorAll('fieldset.member');
    if(fieldsets.length >= MAX_MEMBERS) return;
    memberCount++;
    var fs = document.createElement('fieldset');
    fs.className = 'member';
    fs.innerHTML =
      '<legend>Student</legend>' +
      '<button type="button" class="member-remove">Remove</button>' +
      '<div class="form-grid">' +
        '<div class="field"><label>Full name</label><input type="text" name="member_name_' + memberCount + '" required></div>' +
        '<div class="field"><label>Grade</label>' +
          '<select name="member_grade_' + memberCount + '" required>' +
            '<option value="">Select grade</option>' +
            '<option>9</option><option>10</option><option>11</option><option>12</option>' +
          '</select>' +
        '</div>' +
      '</div>';
    membersWrap.appendChild(fs);
    fs.querySelector('.member-remove').addEventListener('click', function(){
      fs.remove();
      refreshRemoveButtons();
    });
    refreshRemoveButtons();
  });

  membersWrap.querySelectorAll('.member-remove').forEach(function(btn){
    btn.addEventListener('click', function(){
      btn.closest('fieldset.member').remove();
      refreshRemoveButtons();
    });
  });

  refreshRemoveButtons();

  function setError(field, message){
    var wrap = field.closest('.field');
    if(!wrap) return;
    wrap.classList.add('error');
    var msg = wrap.querySelector('.err-msg');
    if(msg) msg.textContent = message;
  }
  function clearError(field){
    var wrap = field.closest('.field');
    if(wrap) wrap.classList.remove('error');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var valid = true;
    var required = form.querySelectorAll('[required]');
    required.forEach(function(field){
      clearError(field);
      if(!field.value || !field.value.trim()){
        setError(field, 'This field is required.');
        valid = false;
      }
    });
    var email = form.querySelector('#advisor_email');
    if(email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
      setError(email, 'Enter a valid email address.');
      valid = false;
    }

    var youtube = form.querySelector('#youtube_link');
    if(youtube && youtube.value && !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(youtube.value.trim())){
      setError(youtube, 'Enter a valid YouTube link.');
      valid = false;
    }

    if(!valid){
      var firstError = form.querySelector('.field.error input, .field.error select, .field.error textarea');
      if(firstError) firstError.focus();
      return;
    }

    var teamName = form.querySelector('#team_name').value.trim();
    var track = form.querySelector('#track').value;
    var confirmId = 'FSRIC-' + new Date().getFullYear() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();

    var shell = document.getElementById('form-shell');
    shell.classList.add('is-submitted');
    var confirmPanel = document.getElementById('confirm-panel');
    confirmPanel.classList.add('is-visible');
    document.getElementById('confirm-team').textContent = teamName;
    document.getElementById('confirm-track').textContent = track;
    document.getElementById('confirm-id').textContent = confirmId;
    confirmPanel.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();
