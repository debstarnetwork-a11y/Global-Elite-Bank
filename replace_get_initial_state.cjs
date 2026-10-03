const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');
let newFunc = fs.readFileSync('temp_get_initial_state.tsx', 'utf8');

const startRegex = /function getInitialState<T>\(key: string, defaultValue: T\): T \{/;
const endText = 'export function BankProvider({ children }: { children: ReactNode }) {';

const startIndex = code.search(startRegex);
const endIndex = code.indexOf(endText);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  fs.writeFileSync('src/store.tsx', before + newFunc + '\n' + after);
  console.log('Replaced getInitialState');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
