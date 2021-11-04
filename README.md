## Recognition of Chess Movements via speech

The project largely aims to recognise chess movements via speech and display it on the UI. It includes features like:
1. Consists of both training and recognition modes
2. Play chess via speech by speaking chess movements like Nf3

Current Progress:
1. Chess: Currently we have designed the UI in a way that entering the movement text in the text field allows playing a move in chess.
2. The above supports 2 player game.
3. Added a speech recognition module which takes 3 samples for 2 words and then performs recognition.
4. The speech feature used for recognition is MFCC

Going ahead:
1. store the samples in a database.
2. train the model with a total of 100 speech samples per text using the tool made.
3. Convert speech to text using the distance between audio fingerprints and performing K-NN to make the final case.

pros of the method used for speech recognition above:
1. Easy to understand and to implement.
2. Pure Javascript, runs on the client side.
3. Fast processing time.
4. Accurate if the vocabulary is chosen carefully (see CONS).
5. Cross-language, you can use any language to train and recognize words.

cons of the method used for speech recognition above:
1. Works well only for limited vocabulary size.
2. The system needs training in order to work, think of 20 words vocabulary or more.
3. The system will work only for the same person who trained it, or for another person if  they have a close voice volume, type, accent, etc’.
4. Can easily confuse between two close words, like “tree” and “free”. Small words are not always captured well, like “up”.
5. Surrounding noises can interrupt and confuse the system.

How to contribute:
1. open an issue with one of the tasks provided below along with expected date of completion.
2. fork the repository
3. Code your appointed tasks
4. Make commits and then request for a pull request

Valid pull requests will be accepted quickly. In case the pull request is not in line with requirements, we shall take it up in discussion.

Tasks available:
1. Making a move history: for every move played, display a 2 column table of move history in the following format:

White - Black
e4 - e5
.
.
.

2. UI design of the web app: make the web app responsive and enhance the UI using particle.js and other UI based tools.

Further tasks will be added as the project grows.

For any queries, write to us at atulsingh.pks@gmail.com
