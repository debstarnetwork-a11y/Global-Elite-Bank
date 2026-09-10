const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Replace the General Settings button logic
code = code.replace(
  /onClick=\{\(\) => setIsGeneralSettingsModalOpen\(true\)\} className="([^"]+)"([\s\S]*?)General Settings/g,
  'onClick={() => setCurrentView(\'settings\')} className="$1"$2App Settings'
);

// Remove the whole General Settings Modal
const modalStart = code.indexOf('{/* General Settings Modal */}');
if (modalStart !== -1) {
  const modalEndStr = '        </div>\n      )}';
  const afterModalStart = code.substring(modalStart);
  const nextModalEnd = afterModalStart.indexOf(modalEndStr) + modalEndStr.length;
  if (nextModalEnd > modalEndStr.length) {
    code = code.substring(0, modalStart) + code.substring(modalStart + nextModalEnd);
  }
}

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log('Patched AdminDashboard Settings');
