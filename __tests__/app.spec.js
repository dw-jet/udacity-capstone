import { noInputError } from '../src/client/js/noInputError'

test('Client errors produce a message', () => {
    document.body.innerHTML = "<section id='results'></section>"
    noInputError();
    expect(document.getElementById('errorMessage').textContent)
    .toBe("Make sure you enter location AND date.")
})