const noInputError = () => {
    const resultsSection = document.getElementById('results');
    const errorMessage =  document.createElement('p');
    errorMessage.id = "errorMessage";
    errorMessage.textContent = "Make sure you enter location AND date.";
    resultsSection.appendChild(errorMessage);
}

export { noInputError }