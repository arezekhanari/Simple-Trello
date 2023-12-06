// Get all cards and tags
const cards = document.querySelectorAll('.card');
const tagSelects = document.querySelectorAll('.tag-select');

// Drag-and-drop functionality
let draggedCard = null;

cards.forEach((card) => {
    card.addEventListener('dragstart', (e) => {
        draggedCard = e.target;
        setTimeout(() => {
            e.target.style.opacity = '0.5';
        }, 0);
    });

    card.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
        sortColumnsByTagValue(); // Sort columns after dropping
    });
});

const column_body = document.querySelectorAll('.column-body');

column_body.forEach((column) => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(column, e.clientY);
        const parent = draggedCard.parentNode;
        if (afterElement == null) {
            column.appendChild(draggedCard);
        } else {
            parent.insertBefore(draggedCard, afterElement);
        }
    });
});

function getDragAfterElement(column, y) {
    const cards = Array.from(column.querySelectorAll('.card:not(.dragging)'));

    return cards.reduce((closest, card) => {
        const box = card.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: card };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Tag selection
tagSelects.forEach((select) => {
    select.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        const parentCard = e.target.closest('.card');
        parentCard.setAttribute('data-tag', selectedValue);
        parentCard.style.backgroundColor = getTagColor(selectedValue);
        sortColumnsByTagValue(); // Sort columns after changing tag
    });
});

function getTagColor(tagValue) {
    switch (tagValue) {
        case 'high':
            return '#FE3939';
        case 'normal':
            return 'white';
        case 'low':
            return '#007FFF';
        default:
            return 'white';
    }
}

// Sorting function
function sortColumnsByTagValue() {
    const column_cardIds = ['do-column-body', 'doing-column-body', 'done-column-body'];
    column_cardIds.forEach((column_cardId) => {
        const column_card = document.getElementById(column_cardId);
        const cardsInColumn = Array.from(column_card.querySelectorAll('.card:not(.dragging)'));
        cardsInColumn.sort((a, b) => {
            const tagA = a.getAttribute('data-tag');
            const tagB = b.getAttribute('data-tag');
            if (tagA === tagB) {
                return 0;
            } else if (tagA === 'high' || (tagA === 'normal' && tagB === 'low')) {
                return -1;
            } else {
                return 1;
            }
        });
        cardsInColumn.forEach((card) => {
            column_card.appendChild(card);
        });
    });
}