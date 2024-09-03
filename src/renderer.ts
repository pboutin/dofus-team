import './ui/styles.css';
import getAdditionalArgument from './ui/utilities/get-additional-argument';
import './ui/windows/dashboard';
import './ui/windows/settings';

window.document.body.dataset.theme = getAdditionalArgument('theme');
