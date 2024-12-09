document.addEventListener('DOMContentLoaded', () => {
    const exerciseListContainer = document.getElementById('exercise-list');

    // Get exercises directly from rendered EJS content
    const allExercises = Array.from(document.querySelectorAll('.exercise')).map(exercise => {
        const name = exercise.querySelector('h2').innerText.trim();
        const type = exercise.querySelector('.type').innerText.trim().toLowerCase();
        const bodyType = exercise.querySelector('.body-type').innerText.trim().toLowerCase();
        const muscle = exercise.querySelector('.muscle').innerText.trim().toLowerCase();
        const equipment = exercise.querySelector('.equipment').innerText.trim();
        const difficulty = exercise.querySelector('.difficulty').innerText.trim().toLowerCase();
        const instructions = Array.from(exercise.querySelectorAll('ul li')).map(li => li.innerText.trim());
        return { name, type, bodyType, muscle, equipment, difficulty, instructions };
    });

    console.log('All Exercises:', allExercises); // Debugging log 

    // Function to display exercises
    function displayExercises(exercises) {
        exerciseListContainer.innerHTML = ''; // Clear existing content
        if (exercises.length === 0) {
            exerciseListContainer.innerHTML = '<p>No exercises found.</p>';
            return;
        }

        exercises.forEach(exercise => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.classList.add('exercise');
            exerciseDiv.innerHTML = `
                <h2>${exercise.name}</h2>
                <p><strong>Type:</strong> ${exercise.type}</p>
                <p><strong>Body Type:</strong> ${exercise.bodyType}</p>
                <p><strong>Muscle:</strong> ${exercise.muscle}</p>
                <p><strong>Equipment:</strong> ${exercise.equipment}</p>
                <p><strong>Difficulty:</strong> ${exercise.difficulty}</p>
                <h3>Instructions:</h3>
                <ul>
                    ${exercise.instructions.map(instr => `<li>${instr}</li>`).join('')}
                </ul>
                <button class="save-workout-btn">Save Workout</button>
            `;
            exerciseListContainer.appendChild(exerciseDiv);

            // Attach save workout event listener
            const saveButton = exerciseDiv.querySelector('.save-workout-btn');
            saveButton.addEventListener('click', () => saveWorkout(exercise));
        });
    }

    // Save workout to the server
    async function saveWorkout(workout) {
        try {
            const response = await fetch('/saveworkout', {
                method: 'Put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workout),
            });

            const result = await response.json();
            if (result.success) {
                alert('Workout saved successfully!');
            } else {
                alert('Failed to save workout. Please try again.');
            }
        } catch (error) {
            console.error('Error saving workout:', error);
            alert('An error occurred. Please try again later.');
        }
    }

    // Filter function triggered by user input
    document.getElementById('filter-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedType = document.getElementById('exercise-type').value.trim().toLowerCase();
        const selectedBodyType = document.getElementById('body-type').value.trim().toLowerCase();
        const selectedMuscle = document.getElementById('muscle-type').value.trim().toLowerCase();

        console.log('Selected Type:', selectedType); // Debug log
        console.log('Selected Body Type:', selectedBodyType); // Debug log
        console.log('Selected Muscle:', selectedMuscle); // Debug log

        const filteredExercises = allExercises.filter(exercise => {
            const typeMatches = selectedType ? exercise.type === selectedType : true;
            const bodyTypeMatches = selectedBodyType ? exercise.bodyType === selectedBodyType : true;
            const muscleMatches = selectedMuscle ? exercise.muscle === selectedMuscle : true;
            return typeMatches && bodyTypeMatches && muscleMatches;
        });

        console.log('Filtered Exercises:', filteredExercises); // Debug log

        displayExercises(filteredExercises);
    });

    // Initial display of all exercises when the page loads
    displayExercises(allExercises);
});
document.addEventListener('DOMContentLoaded', () => {
    const savedExercisesContainer = document.getElementById('saved-exercises');
  
    // Handle delete button click
    savedExercisesContainer.addEventListener('click', async (event) => {
      if (event.target.classList.contains('delete-workout-btn')) {
        const exerciseDiv = event.target.closest('.exercise');
        const workoutId = exerciseDiv.dataset.id;
  
        try {
          const response = await fetch(`/deleteworkout/${workoutId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          const result = await response.json();
          if (result.success) {
            alert('Workout deleted successfully!');
            exerciseDiv.remove(); // Remove the workout from the display
          } else {
            alert('Failed to delete workout. Please try again.');
          }
        } catch (error) {
          console.error('Error deleting workout:', error);
          alert('An error occurred. Please try again later.');
        }
      }
    });
  });