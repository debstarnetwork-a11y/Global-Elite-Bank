let actionForm = { status: '', type: 'Credit', amount: '' };
let currentActiveUser = { id: '1', status: 'active' };

function updateUserStatus(id, status) {
  console.log('updateUserStatus called with', id, status);
  currentActiveUser.status = status;
}

function onChange(val) {
  actionForm = { ...actionForm, status: val };
}

function onClick() {
  if (actionForm.status) {
    updateUserStatus(currentActiveUser.id, (actionForm.status || currentActiveUser.status));
  }
  // reset
  actionForm = { status: '', type: 'Credit', amount: '' };
}

console.log('Init state value:', actionForm.status || currentActiveUser.status);
onChange('dormant');
console.log('After onChange value:', actionForm.status || currentActiveUser.status);
onClick();
console.log('After onClick value:', actionForm.status || currentActiveUser.status);

