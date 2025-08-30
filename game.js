document.addEventListener('DOMContentLoaded', () => {
    // --- Setup ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const restartPlantBtn = document.getElementById('restartPlantBtn');
    const restartPopulousBtn = document.getElementById('restartPopulousBtn');
    const populationCountSpan = document.getElementById('populationCount');
    const maxAgeSpan = document.getElementById('maxAge');
    const speciesCountSpan = document.getElementById('speciesCount');
    const topSpeciesPopSpan = document.getElementById('topSpeciesPop');
    const avgEnergySpan = document.getElementById('avgEnergy');
    const speedSlider = document.getElementById('speedSlider');
    const lifespanSlider = document.getElementById('lifespanSlider');
    const mutationSlider = document.getElementById('mutationSlider');
    const foodSpawnSlider = document.getElementById('foodSpawnSlider');
    const freshFoodEnergySlider = document.getElementById('freshFoodEnergySlider');
    const regularFoodEnergySlider = document.getElementById('regularFoodEnergySlider');
    const rottenFoodEnergySlider = document.getElementById('rottenFoodEnergySlider');
    const foodDecaySlider = document.getElementById('foodDecaySlider');
    const initialPopulationInput = document.getElementById('initialPopulationInput');
    const reproductionCostSlider = document.getElementById('reproductionCostSlider');
    const metabolicCostSlider = document.getElementById('metabolicCostSlider');
    const moversCanProduceCheckbox = document.getElementById('moversCanProduceCheckbox');
    const killerDamageSlider = document.getElementById('killerDamageSlider');
    const rotationEnabledCheckbox = document.getElementById('rotationEnabledCheckbox');
    const brainMutationSlider = document.getElementById('brainMutationSlider');
    const mutagenBonusSlider = document.getElementById('mutagenBonusSlider');
    const lookRangeSlider = document.getElementById('lookRangeSlider');
    const reproduceOnFoodCheckbox = document.getElementById('reproduceOnFoodCheckbox');
    const initialCellCountSlider = document.getElementById('initialCellCountSlider');
    const initialRandomnessSlider = document.getElementById('initialRandomnessSlider');
    const plantRatioSlider = document.getElementById('plantRatioSlider');
    const resolutionSlider = document.getElementById('resolutionSlider');
    const worldWrappingCheckbox = document.getElementById('worldWrappingCheckbox');
    const diagonalProductionCheckbox = document.getElementById('diagonalProductionCheckbox');
    const skinOpacitySlider = document.getElementById('skinOpacitySlider');
    const skinThicknessSlider = document.getElementById('skinThicknessSlider');
    const innerRoundedSkinCheckbox = document.getElementById('innerRoundedSkinCheckbox');
    const animalIntelligenceSlider = document.getElementById('animalIntelligenceSlider');
    const allowSingleCellCheckbox = document.getElementById('allowSingleCellCheckbox');
    const moversAreMouthsCheckbox = document.getElementById('moversAreMouthsCheckbox');
    const plantSpawner = document.getElementById('plant-spawner');
    const populousSpawner = document.getElementById('populous-spawner');
    const cellEvolutionSlider = document.getElementById('cellEvolutionSlider');
    const plantSpawnerCanvas = document.getElementById('plant-spawner-canvas');
    const populousSpawnerCanvas = document.getElementById('populous-spawner-canvas');
    const animalSpawner = document.getElementById('animal-spawner');
    const smartAnimalSpawner = document.getElementById('smart-animal-spawner');
    const animalSpawnerCanvas = document.getElementById('animal-spawner-canvas');
    const smartAnimalSpawnerCanvas = document.getElementById('smart-animal-spawner-canvas');

    // --- Game Configuration ---
    const CONFIG = {
        RESOLUTION: 8,
        CANVAS_WIDTH: 800,
        CANVAS_HEIGHT: 600,
        FOOD_SPAWN_PROBABILITY: 0,
        FRESH_FOOD_ENERGY: 8,
        REGULAR_FOOD_ENERGY: 5,
        ROTTEN_FOOD_ENERGY: 2,
        FOOD_DECAY_TIME: 300,
        INITIAL_ORGANISMS: 15,
        INITIAL_CELL_COUNT: 2,
        INITIAL_RANDOMNESS: 1,
        PLANT_RATIO: 0.5, // 50%
        ANIMAL_INTELLIGENCE_RATIO: 0.3, // 30%
        ALLOW_SINGLE_CELL: false,
        MOVERS_ARE_MOUTHS: false,
        LIFESPAN_MULTIPLIER: 200,
        REPRODUCTION_ENERGY_COST: 5,
        METABOLIC_COST: 0.01,
        KILLER_CELL_DAMAGE: 4,
        CELL_EVOLUTION_RATE: 0.02, // 2%
        BRAIN_MUTATION_RATE: 0.05, // 5%
        MUTAGEN_BONUS: 0.1, // 10%
        ROTATION_ENABLED: true,
        WORLD_WRAPPING: false,
        SKIN_OPACITY: 0.6,
        SKIN_THICKNESS: 2,
        INNER_ROUNDED_SKIN: false,
        LOOK_RANGE: 5,
        MOVERS_CAN_PRODUCE: false,
        REPRODUCE_ON_FOOD: false,
        DIAGONAL_PRODUCTION: false,
        MUTATION_RATE: 0.05, // 5%
        COLORS: {
            BACKGROUND: '#2a2a2a',
            FOOD: '#81d2c7', // Regular food
            FRESH_FOOD: '#C1FFC1', // Light green
            ROTTEN_FOOD: '#5C4033' // Dark brown
        }
    };

    // --- Game State ---
    let grid;
    let organisms = [];
    let foodCoords = [];
    let isPaused = true;
    let animationFrameId;
    let lastFrameTime = 0;
    let fps = 30;
    let mostPopulousOrganismTemplate = null;
    let selectedOrganismTemplate = null;
    let selectedSpawnerItem = null;
    let COLS, ROWS;

    // --- Grid Entity Types ---
    const ENTITY_TYPE = {
        EMPTY: 0,
        FOOD: 1,
        ORGANISM_CELL: 2
    };

    // --- Organism Cell Types ---
    const CELL_TYPES = {
        MOUTH: { name: 'Mouth', color: '#FFFF00' }, // Pure Yellow
        PRODUCER: { name: 'Producer', color: '#2ECC40' }, // Green
        MOVER: { name: 'Mover', color: '#3498db' }, // Blue
        KILLER: { name: 'Killer', color: '#FF4136' }, // Red
        ARMOR: { name: 'Armor', color: '#95a5a6' }, // Gray
        EYE: { name: 'Eye', color: '#FFFFFF' }, // White
        MUTAGEN: { name: 'Mutagen', color: '#9B59B6' }, // Purple
    };

    const DIRECTIONS = {
        UP:         { x: 0,  y: -1, name: 'UP' },
        DOWN:       { x: 0,  y: 1,  name: 'DOWN' },
        LEFT:       { x: -1, y: 0,  name: 'LEFT' },
        RIGHT:      { x: 1,  y: 0,  name: 'RIGHT' },
        UP_LEFT:    { x: -1, y: -1, name: 'UP_LEFT' },
        UP_RIGHT:   { x: 1,  y: -1, name: 'UP_RIGHT' },
        DOWN_LEFT:  { x: -1, y: 1,  name: 'DOWN_LEFT' },
        DOWN_RIGHT: { x: 1,  y: 1,  name: 'DOWN_RIGHT' },
    };
    DIRECTIONS.LIST = Object.values(DIRECTIONS);
    DIRECTIONS.OPPOSITES = {
        UP: DIRECTIONS.DOWN,
        DOWN: DIRECTIONS.UP,
        LEFT: DIRECTIONS.RIGHT,
        RIGHT: DIRECTIONS.LEFT,
        UP_LEFT: DIRECTIONS.DOWN_RIGHT,
        UP_RIGHT: DIRECTIONS.DOWN_LEFT,
        DOWN_LEFT: DIRECTIONS.UP_RIGHT,
        DOWN_RIGHT: DIRECTIONS.UP_LEFT,
    };

    const Decision = {
        NEUTRAL: 0,
        RETREAT: 1,
        CHASE: 2,
    };

    // --- Brain Class ---
    class Brain {
        constructor() {
            this.observations = [];
            this.decisions = {};
            // Set sensible defaults
            for (const key in CELL_TYPES) {
                this.decisions[CELL_TYPES[key].name] = Decision.NEUTRAL;
            }
            // Default food preferences
            this.decisions['Fresh Food'] = Decision.CHASE;
            this.decisions['Regular Food'] = Decision.CHASE;
            this.decisions['Rotten Food'] = Decision.NEUTRAL;
            this.decisions[CELL_TYPES.KILLER.name] = Decision.RETREAT;
        }

        observe(entity, x, y, distance, direction) {
            this.observations.push({ entity, x, y, distance, direction });
        }

        decide(currentX, currentY) {
            if (this.observations.length === 0) {
                // No observations, move randomly
                return { moveX: Math.floor(Math.random() * 3) - 1, moveY: Math.floor(Math.random() * 3) - 1 };
            }

            // Find the closest observation
            const closestObs = this.observations.reduce((closest, current) => {
                return (current.distance < closest.distance) ? current : closest;
            });

            this.observations = []; // Clear observations for next tick

            let decisionType = Decision.NEUTRAL;
            if (closestObs.entity.type === ENTITY_TYPE.FOOD) {
                const foodState = closestObs.entity.state; // 'fresh', 'regular', 'rotten'
                // Construct the key, e.g., "Fresh Food"
                const decisionKey = `${foodState.charAt(0).toUpperCase() + foodState.slice(1)} Food`;
                decisionType = this.decisions[decisionKey];
                if (typeof decisionType === 'undefined') {
                    decisionType = Decision.NEUTRAL; // Fallback for safety
                }
            } else if (closestObs.entity.type === ENTITY_TYPE.ORGANISM_CELL) {
                const cellTypeName = closestObs.entity.cellRef.type.name;
                decisionType = this.decisions[cellTypeName];
            }

            if (decisionType === Decision.CHASE) {
                const moveX = closestObs.direction.x;
                const moveY = closestObs.direction.y;
                return { moveX, moveY, isDirected: true };
            } else if (decisionType === Decision.RETREAT) {
                const oppositeDir = DIRECTIONS.OPPOSITES[closestObs.direction.name];
                const moveX = oppositeDir.x;
                const moveY = oppositeDir.y;
                return { moveX, moveY, isDirected: true };
            }

            // Neutral or unknown, move randomly
            return { moveX: Math.floor(Math.random() * 3) - 1, moveY: Math.floor(Math.random() * 3) - 1, isDirected: false };
        }

        mutate() {
            const decisionKeys = Object.keys(this.decisions);
            const randomKey = decisionKeys[Math.floor(Math.random() * decisionKeys.length)];
            // Don't mutate the reaction to high-value food as it's almost always beneficial to chase it.
            if (randomKey === 'Fresh Food' || randomKey === 'Regular Food') return;

            const randomDecision = Math.floor(Math.random() * 3); // 0, 1, or 2
            this.decisions[randomKey] = randomDecision;
        }
    }

    // --- Cell Class (part of an organism) ---
    class Cell {
        constructor(type, relativeX = 0, relativeY = 0, stage = 1) {
            this.type = type;
            this.relativeX = relativeX;
            this.relativeY = relativeY;
            this.stage = stage;
        }
    }

    // --- Organism Class ---
    class Organism {
        constructor(x, y, cells, parent = null) {
            this.x = x;
            this.y = y;
            this.cells = cells;
            this.energy = 5;
            this.age = 0;
            this.health = this.cells.length;
            this.lifespan = this.cells.length * CONFIG.LIFESPAN_MULTIPLIER;
            this.rotation = 0; // 0: Up, 1: Right, 2: Down, 3: Left
            this.ignoreBrainTicks = 0;
            this.brain = new Brain();

            if (parent) {
                this.speciesId = parent.speciesId;
                this.rotation = parent.rotation; // Inherit rotation
                this.brain.decisions = JSON.parse(JSON.stringify(parent.brain.decisions)); // Deep copy decisions
            } else {
                this.speciesId = `hsl(${Math.random() * 360}, 70%, 70%)`;
            }

            if (parent) {
                let anatomyMutationRate = CONFIG.MUTATION_RATE;
                let brainMutationRate = CONFIG.BRAIN_MUTATION_RATE;

                // Check for mutagen cells and apply bonus for each one
                const mutagenCount = this.cells.filter(c => c.type === CELL_TYPES.MUTAGEN).length;
                if (mutagenCount > 0) {
                    const totalBonus = CONFIG.MUTAGEN_BONUS * mutagenCount;
                    anatomyMutationRate += totalBonus;
                    brainMutationRate += totalBonus;
                }

                // Anatomical mutation (creates a new species)
                if (Math.random() < anatomyMutationRate) {
                    this.mutateAnatomy();
                    this.speciesId = `hsl(${Math.random() * 360}, 70%, 70%)`;
                }
                // Brain mutation (behavioral change within the same species)
                if (this.cells.some(c => c.type === CELL_TYPES.EYE) && Math.random() < brainMutationRate) {
                    this.brain.mutate();
                }
                // Cell Stage Evolution (does not create new species)
                if (Math.random() < CONFIG.CELL_EVOLUTION_RATE) {
                    this.mutateCellStage();
                }
            }
        }



        getRotatedCoords(cell, rotationOverride = this.rotation) {
            let { relativeX: x, relativeY: y } = cell;
            // Apply rotation (90 degrees clockwise per increment)
            for (let i = 0; i < rotationOverride; i++) {
                [x, y] = [y, -x];
            }
            return { x, y };
        }

        update() {
            this.age++;

            const hasMover = this.cells.some(c => c.type === CELL_TYPES.MOVER);

            // Metabolic cost is only applied to mobile organisms, as in the original game.
            if (hasMover) {
                this.energy -= CONFIG.METABOLIC_COST;
            }

            if (this.age > this.lifespan || this.energy <= 0 || this.health <= 0) {
                this.die();
                return;
            }

            this.performCellFunctions(hasMover);
            if (this.energy >= this.getReproductionCost()) {
                this.reproduce();
            }
        }

        getReproductionCost() {
            // Cost is the potential energy gain from eating the offspring, plus a base cost.
            // This prevents infinite energy exploits from creating and consuming offspring.
            return (this.cells.length * CONFIG.FRESH_FOOD_ENERGY) + CONFIG.REPRODUCTION_ENERGY_COST;
        }

        performCellFunctions(hasMover) {
            this.cells.forEach(cell => {
                const rotated = this.getRotatedCoords(cell);
                const pos = getGridPosition(this.x + rotated.x, this.y + rotated.y);
                if (!pos) return; // Cell is out of bounds, do nothing.
                const { x: absoluteX, y: absoluteY } = pos;

                if (cell.type === CELL_TYPES.MOUTH || (CONFIG.MOVERS_ARE_MOUTHS && cell.type === CELL_TYPES.MOVER)) {
                    this.findAndEat(absoluteX, absoluteY);
                } else if (cell.type === CELL_TYPES.PRODUCER) {
                    this.produceFood(absoluteX, absoluteY, hasMover);
                } else if (cell.type === CELL_TYPES.KILLER) {
                    this.attack(absoluteX, absoluteY);
                } else if (cell.type === CELL_TYPES.EYE) {
                    this.observe(absoluteX, absoluteY);
                }
            });

            if (hasMover) {
                this.move();
            }
        }

        observe(eyeX, eyeY) {
            const lookRange = CONFIG.LOOK_RANGE;

            // Scan in all 8 directions from the eye cell
            for (const direction of DIRECTIONS.LIST) {
                for (let i = 1; i <= lookRange; i++) {
                    const pos = getGridPosition(eyeX + direction.x * i, eyeY + direction.y * i);
                    if (!pos) break; // Stop looking if we hit the edge of the world

                    const entity = grid[pos.x][pos.y];
                    if (entity && entity.type !== ENTITY_TYPE.EMPTY) {
                        if (entity.owner !== this) {
                            this.brain.observe(entity, pos.x, pos.y, i, direction);
                        }
                        break; // Found something in this direction, move to the next
                    }
                }
            }
        }

        findAndEat(mouthX, mouthY) {
            const adjacentOffsets = [
                [0, 1],  // Down
                [0, -1], // Up
                [1, 0],  // Right
                [-1, 0]  // Left
            ];

            for (const [dx, dy] of adjacentOffsets) {
                const pos = getGridPosition(mouthX + dx, mouthY + dy);
                if (!pos) continue;

                const foodCell = grid[pos.x][pos.y];
                if (foodCell && foodCell.type === ENTITY_TYPE.FOOD) {
                    switch (foodCell.state) {
                        case 'fresh':
                            this.energy += CONFIG.FRESH_FOOD_ENERGY;
                            break;
                        case 'rotten':
                            const hasStomach = this.cells.some(c => c.type === CELL_TYPES.MOUTH && c.stage === 2);
                            if (hasStomach) {
                                this.energy += CONFIG.REGULAR_FOOD_ENERGY; // Stomach bonus!
                            } else {
                                this.energy += CONFIG.ROTTEN_FOOD_ENERGY;
                            }
                            break;
                        default: // 'regular'
                            this.energy += CONFIG.REGULAR_FOOD_ENERGY;
                    }
                    const foodIndex = foodCoords.findIndex(c => c.x === pos.x && c.y === pos.y);
                    if (foodIndex > -1) foodCoords.splice(foodIndex, 1);

                    grid[pos.x][pos.y] = { // Remove food from grid
                        type: ENTITY_TYPE.EMPTY
                    };
                    return;
                }
            }
        }

        produceFood(producerX, producerY, isMover) {
            // If this organism is a mover, check if they are allowed to produce.
            if (isMover && !CONFIG.MOVERS_CAN_PRODUCE) {
                return; // Exit if movers are not allowed to produce.
            }

            // Base probability to produce food in a tick.
            let productionProbability = 0.015;

            // Movers are less efficient at producing food, creating a trade-off.
            if (isMover) {
                productionProbability /= 4; // Drastically reduce efficiency if it can move.
            }

            if (Math.random() < productionProbability) {
                // Try to place food in an adjacent empty cell.
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) continue;
                        // If diagonal production is off, skip diagonal checks (where both i and j are non-zero)
                        if (!CONFIG.DIAGONAL_PRODUCTION && i !== 0 && j !== 0) {
                            continue;
                        }
                        const pos = getGridPosition(producerX + i, producerY + j);
                        if (!pos) continue;

                        if (grid[pos.x][pos.y].type === ENTITY_TYPE.EMPTY) {
                            grid[pos.x][pos.y] = { type: ENTITY_TYPE.FOOD, state: 'regular', age: 0 };
                            foodCoords.push({ x: pos.x, y: pos.y });
                            return; // Successfully produced food, exit.
                        }
                    }
                }
            }
        }

        attack(killerX, killerY) {
            const adjacentOffsets = [
                [0, 1],  // Down
                [0, -1], // Up
                [1, 0],  // Right
                [-1, 0]  // Left
            ];

            for (const [dx, dy] of adjacentOffsets) {
                const pos = getGridPosition(killerX + dx, killerY + dy);
                if (!pos) continue;

                const target = grid[pos.x][pos.y];
                if (target && target.type === ENTITY_TYPE.ORGANISM_CELL && target.owner !== this) {
                    target.owner.takeDamage(CONFIG.KILLER_CELL_DAMAGE);
                }
            }
        }

        takeDamage(amount) {
            const hasArmor = this.cells.some(c => c.type === CELL_TYPES.ARMOR);
            if (hasArmor) {
                return; // No damage if armored
            }

            this.health -= amount;
        }

        move() {
            let moveX, moveY, isDirected;

            if (this.ignoreBrainTicks > 0) {
                this.ignoreBrainTicks--;
                moveX = Math.floor(Math.random() * 3) - 1;
                moveY = Math.floor(Math.random() * 3) - 1;
                isDirected = false;
            } else {
                const brainDecision = this.brain.decide(this.x, this.y);
                moveX = brainDecision.moveX;
                moveY = brainDecision.moveY;
                isDirected = brainDecision.isDirected;
            }
            
            const prospectiveX = this.x + moveX;
            const prospectiveY = this.y + moveY;

            const canMove = this.cells.every(cell => {
                const rotated = this.getRotatedCoords(cell);
                const destPos = getGridPosition(prospectiveX + rotated.x, prospectiveY + rotated.y);

                // 1. The destination for each cell must be valid (in-bounds and passable)
                if (!destPos) return false;
                const destCell = grid[destPos.x][destPos.y];
                const isDestinationPassable = destCell.type === ENTITY_TYPE.EMPTY || destCell.owner === this;
                if (!isDestinationPassable) return false;

                // 2. On diagonal moves, check for corner-cutting.
                // The organism can't squeeze through a 1-cell diagonal gap.
                if (moveX !== 0 && moveY !== 0) {
                    const corner1Pos = getGridPosition(this.x + moveX + rotated.x, this.y + rotated.y);
                    const corner2Pos = getGridPosition(this.x + rotated.x, this.y + moveY + rotated.y);

                    const isCorner1Passable = corner1Pos && (grid[corner1Pos.x][corner1Pos.y].type === ENTITY_TYPE.EMPTY || grid[corner1Pos.x][corner1Pos.y].owner === this);
                    const isCorner2Passable = corner2Pos && (grid[corner2Pos.x][corner2Pos.y].type === ENTITY_TYPE.EMPTY || grid[corner2Pos.x][corner2Pos.y].owner === this);

                    if (!isCorner1Passable && !isCorner2Passable) {
                        return false; // Both corners are blocked, so the path is blocked.
                    }
                }

                return true; // This cell's path is clear
            });

            if (canMove) {
                this.clearFromGrid();
                this.x = CONFIG.WORLD_WRAPPING ? (prospectiveX + COLS) % COLS : prospectiveX;
                this.y = CONFIG.WORLD_WRAPPING ? (prospectiveY + ROWS) % ROWS : prospectiveY;
                this.placeOnGrid();
            } else {
                // Movement failed.
                if (isDirected) {
                    // The brain's plan failed. Get unstuck.
                    this.ignoreBrainTicks = 5;
                }
                // In any case of failed movement, try to rotate.
                this.attemptRotation();
            }
        }

        attemptRotation() {
            if (!CONFIG.ROTATION_ENABLED) return;

            const newRotation = (this.rotation + 1) % 4;

            // Check if the new rotation is valid before applying it.
            const canRotate = this.cells.every(cell => {
                const rotated = this.getRotatedCoords(cell, newRotation);
                const pos = getGridPosition(this.x + rotated.x, this.y + rotated.y);
                if (!pos) return false; // Can't rotate into world edge
                const targetCell = grid[pos.x][pos.y];
                // Can only rotate if the new position is empty or part of our own body
                return targetCell.type === ENTITY_TYPE.EMPTY || targetCell.owner === this;
            });

            if (canRotate) {
                this.clearFromGrid();
                this.rotation = newRotation;
                this.placeOnGrid();
            }
        }

        clearFromGrid() {
            this.cells.forEach(cell => {
                const rotated = this.getRotatedCoords(cell);
                const pos = getGridPosition(this.x + rotated.x, this.y + rotated.y);
                if (pos) {
                    const gridCell = grid[pos.x][pos.y];
                    // This is a paranoid check to prevent race conditions. An organism can only
                    // clear a grid space if it's absolutely certain it's one of its own cells.
                    if (gridCell.owner === this && gridCell.cellRef === cell) {
                        grid[pos.x][pos.y] = { type: ENTITY_TYPE.EMPTY };
                    }
                }
            });
        }

        reproduce() {
            // Spend energy whether reproduction is successful or not.
            this.energy -= this.getReproductionCost();

            const REPRODUCTION_ATTEMPTS = 3; // Try a few times to find a spot.
            const DISTANCE_MIN = 2;
            const DISTANCE_MAX = 5;

            for (let attempt = 0; attempt < REPRODUCTION_ATTEMPTS; attempt++) {
                // Pick one random spot to attempt to place offspring.
                const angle = Math.random() * 2 * Math.PI;
                const distance = DISTANCE_MIN + Math.random() * (DISTANCE_MAX - DISTANCE_MIN);
                const offsetX = Math.round(Math.cos(angle) * distance);
                const offsetY = Math.round(Math.sin(angle) * distance);
                const prospectiveX = this.x + offsetX;
                const prospectiveY = this.y + offsetY;

                // Create a new organism to check for placement
                const newOrganism = new Organism(prospectiveX, prospectiveY, this.cells.map(c => new Cell(c.type, c.relativeX, c.relativeY, c.stage)), this);
                if (CONFIG.ROTATION_ENABLED) {
                    newOrganism.rotation = Math.floor(Math.random() * 4);
                }

                const canPlace = newOrganism.cells.every(cell => {
                    const rotated = newOrganism.getRotatedCoords(cell);
                    const pos = getGridPosition(newOrganism.x + rotated.x, newOrganism.y + rotated.y);
                    if (!pos) return false;
                    const targetCell = grid[pos.x][pos.y];
                    return targetCell && (targetCell.type === ENTITY_TYPE.EMPTY || (CONFIG.REPRODUCE_ON_FOOD && targetCell.type === ENTITY_TYPE.FOOD));
                });

                if (canPlace) {
                    // If reproducing on food, the new organism consumes it for starting energy.
                    if (CONFIG.REPRODUCE_ON_FOOD) {
                        newOrganism.cells.forEach(cell => {
                            const rotated = newOrganism.getRotatedCoords(cell);
                            const pos = getGridPosition(newOrganism.x + rotated.x, newOrganism.y + rotated.y);
                            if (pos && grid[pos.x][pos.y].type === ENTITY_TYPE.FOOD) {
                                const foodCell = grid[pos.x][pos.y];
                                switch (foodCell.state) {
                                    case 'fresh': newOrganism.energy += CONFIG.FRESH_FOOD_ENERGY; break;
                                    case 'rotten': newOrganism.energy += CONFIG.ROTTEN_FOOD_ENERGY; break;
                                    default: newOrganism.energy += CONFIG.REGULAR_FOOD_ENERGY;
                                }
                                // Remove the eaten food from tracking
                                const foodIndex = foodCoords.findIndex(c => c.x === pos.x && c.y === pos.y);
                                if (foodIndex > -1) foodCoords.splice(foodIndex, 1);
                            }
                        });
                    }

                    newOrganism.x = CONFIG.WORLD_WRAPPING ? (newOrganism.x + COLS) % COLS : newOrganism.x;
                    newOrganism.y = CONFIG.WORLD_WRAPPING ? (newOrganism.y + ROWS) % ROWS : newOrganism.y;
                    organisms.push(newOrganism);
                    newOrganism.placeOnGrid();
                    return; // Successfully reproduced
                }
            }
        }

        mutateAnatomy() {
            const mutationType = Math.random();
            if (mutationType < 0.5) { // Add cell
                const randomCell = this.cells[Math.floor(Math.random() * this.cells.length)];
                const newPos = { x: randomCell.relativeX + Math.floor(Math.random() * 3) - 1, y: randomCell.relativeY + Math.floor(Math.random() * 3) - 1 };
                const posExists = this.cells.some(c => c.relativeX === newPos.x && c.relativeY === newPos.y);
                if (!posExists) {
                    let randomType;
                    do {
                        randomType = Object.values(CELL_TYPES)[Math.floor(Math.random() * Object.values(CELL_TYPES).length)];
                    } while (CONFIG.MOVERS_ARE_MOUTHS && randomType === CELL_TYPES.MOUTH);
                    this.cells.push(new Cell(randomType, newPos.x, newPos.y));
                }
            } else if (mutationType < 0.8) { // Change cell
                const randomCell = this.cells[Math.floor(Math.random() * this.cells.length)];
                let newType;
                do {
                    newType = Object.values(CELL_TYPES)[Math.floor(Math.random() * Object.values(CELL_TYPES).length)];
                } while (CONFIG.MOVERS_ARE_MOUTHS && newType === CELL_TYPES.MOUTH);
                randomCell.type = newType;
            } else { // Remove cell
                if (this.cells.length > (CONFIG.ALLOW_SINGLE_CELL ? 1 : 2)) {
                    this.cells.splice(Math.floor(Math.random() * this.cells.length), 1);
                }
            }
            this.health = this.cells.length;
            this.lifespan = this.cells.length * CONFIG.LIFESPAN_MULTIPLIER;
        }

        mutateCellStage() {
            if (this.cells.length === 0) return;

            const mouthCells = this.cells.filter(c => c.type === CELL_TYPES.MOUTH);
            if (mouthCells.length === 0) return;

            const cellToMutate = mouthCells[Math.floor(Math.random() * mouthCells.length)];

            // 50/50 chance to evolve or devolve, if possible
            if (cellToMutate.stage === 1 && Math.random() < 0.5) {
                cellToMutate.stage = 2; // Evolve to Stomach
            } else if (cellToMutate.stage === 2 && Math.random() < 0.5) {
                cellToMutate.stage = 1; // Devolve to Mouth
            }
        }

        die() {
            this.cells.forEach(cell => {
                const rotated = this.getRotatedCoords(cell);
                const pos = getGridPosition(this.x + rotated.x, this.y + rotated.y);
                if (pos) {
                    // Only convert the cell to food if this organism still occupies it.
                    // This prevents destroying parts of other organisms in a race condition.
                    const gridCell = grid[pos.x][pos.y];
                    if (gridCell && gridCell.owner === this) {
                        grid[pos.x][pos.y] = { type: ENTITY_TYPE.FOOD, state: 'fresh', age: 0 };
                        foodCoords.push({ x: pos.x, y: pos.y });
                    }
                }
            });
            this.health = 0; // Mark for removal
        }
    }

    Organism.prototype.placeOnGrid = function() {
        this.cells.forEach(cell => {
            const rotated = this.getRotatedCoords(cell);
            const pos = getGridPosition(this.x + rotated.x, this.y + rotated.y);
            if (pos) {
                grid[pos.x][pos.y] = { type: ENTITY_TYPE.ORGANISM_CELL, owner: this, cellRef: cell };
            }
        });
    };

    function rebuildAfterResize() {
        // 1. Store the current state
        const oldOrganisms = [...organisms];
        const oldFood = [];
        for (const coord of foodCoords) {
            const foodCell = grid[coord.x][coord.y];
            if (foodCell.type === ENTITY_TYPE.FOOD) {
                oldFood.push({ ...coord, ...foodCell });
            }
        }
        const oldCols = COLS;
        const oldRows = ROWS;

        // 2. Pause the simulation and update dimensions
        isPaused = true;
        startPauseBtn.textContent = 'Start';
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        updateDimensions(); // This sets new COLS and ROWS

        // 3. Create a new, empty grid and clear current state arrays
        grid = buildGrid();
        organisms = [];
        foodCoords = [];

        // 4. Attempt to place old organisms onto the new grid
        oldOrganisms.forEach(org => {
            // Scale position to the new grid size
            org.x = Math.round(org.x * (COLS / oldCols));
            org.y = Math.round(org.y * (ROWS / oldRows));

            // Make sure the organism is within the new bounds
            if (org.x >= COLS) org.x = COLS - 1;
            if (org.y >= ROWS) org.y = ROWS - 1;

            const canPlace = org.cells.every(cell => {
                const rotated = org.getRotatedCoords(cell);
                const pos = getGridPosition(org.x + rotated.x, org.y + rotated.y);
                return pos && grid[pos.x][pos.y].type === ENTITY_TYPE.EMPTY;
            });

            if (canPlace) {
                organisms.push(org);
                org.placeOnGrid();
            }
        });

        // 5. Attempt to place old food onto the new grid
        oldFood.forEach(food => {
            // Scale position to the new grid size
            const newX = Math.round(food.x * (COLS / oldCols));
            const newY = Math.round(food.y * (ROWS / oldRows));

            // Make sure the food is within the new bounds
            if (newX >= COLS || newY >= ROWS) return;

            // Only place food if the spot is empty
            if (grid[newX][newY].type === ENTITY_TYPE.EMPTY) {
                grid[newX][newY] = { type: ENTITY_TYPE.FOOD, state: food.state, age: food.age, spots: food.spots };
                foodCoords.push({ x: newX, y: newY });
            }
        });

        // 6. Redraw and update stats
        drawGrid();
        updateStats();
    }

    // --- Spawner and Painting Functions ---

    function drawOrganismPreview(canvas, cells) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!cells || cells.length === 0) {
            return;
        }

        // Find bounds to center the organism
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        cells.forEach(cell => {
            minX = Math.min(minX, cell.relativeX);
            minY = Math.min(minY, cell.relativeY);
            maxX = Math.max(maxX, cell.relativeX);
            maxY = Math.max(maxY, cell.relativeY);
        });

        const orgWidth = maxX - minX + 1;
        const orgHeight = maxY - minY + 1;

        const maxDim = Math.max(orgWidth, orgHeight);
        const cellSize = Math.floor(canvas.width / (maxDim + 2)); // Add padding

        const offsetX = (canvas.width - orgWidth * cellSize) / 2;
        const offsetY = (canvas.height - orgHeight * cellSize) / 2;

        cells.forEach(cell => {
            const x = offsetX + (cell.relativeX - minX) * cellSize;
            const y = offsetY + (cell.relativeY - minY) * cellSize;
            ctx.fillStyle = cell.type.color;
            ctx.fillRect(x, y, cellSize, cellSize);

            if (cell.type === CELL_TYPES.EYE) {
                ctx.fillStyle = '#000000';
                const pupilSize = Math.max(1, Math.floor(cellSize / 3));
                const pupilOffset = Math.floor((cellSize - pupilSize) / 2);
                ctx.fillRect(x + pupilOffset, y + pupilOffset, pupilSize, pupilSize);
            }
        });
    }

    function paintOrganism(col, row, template) {
        if (!template) return false;

        const newOrganism = new Organism(col, row, template.map(c => new Cell(c.type, c.relativeX, c.relativeY, c.stage)));
        newOrganism.speciesId = `hsl(${Math.random() * 360}, 70%, 70%)`; // Give it a new species ID

        const canPlace = newOrganism.cells.every(cell => {
            const rotated = newOrganism.getRotatedCoords(cell);
            const pos = getGridPosition(newOrganism.x + rotated.x, newOrganism.y + rotated.y);
            return pos && grid[pos.x][pos.y].type === ENTITY_TYPE.EMPTY;
        });

        if (canPlace) {
            organisms.push(newOrganism);
            newOrganism.placeOnGrid();
            return true;
        }
        return false;
    }

    // --- Core Functions ---

    function setupCanvasSize() {
        const container = canvas.parentElement;
        if (!container) return;

        // Calculate canvas size to fit the container while maintaining a 4:3 aspect ratio
        const containerWidth = container.clientWidth;
        const newWidth = Math.min(containerWidth, 1400); // Use a max-width of 1400 for desktop
        const newHeight = Math.floor(newWidth * (600 / 800));

        // Update config and canvas element
        CONFIG.CANVAS_WIDTH = newWidth;
        CONFIG.CANVAS_HEIGHT = newHeight;
        canvas.width = newWidth;
        canvas.height = newHeight;
    }

    function getGridPosition(x, y) {
        if (CONFIG.WORLD_WRAPPING) {
            return { x: (x + COLS) % COLS, y: (y + ROWS) % ROWS };
        }
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
            return null;
        }
        return { x, y };
    }

    function updateDimensions() {
        COLS = Math.floor(CONFIG.CANVAS_WIDTH / CONFIG.RESOLUTION);
        ROWS = Math.floor(CONFIG.CANVAS_HEIGHT / CONFIG.RESOLUTION);
    }

    function buildGrid() {
        return new Array(COLS).fill(null)
            .map(() => new Array(ROWS).fill(null).map(() => ({ type: ENTITY_TYPE.EMPTY })));
    }

    function setup() {
        grid = buildGrid();
        organisms = [];
        foodCoords = [];

        // Helper to perform a constrained mutation for initial generation
        const performInitialMutation = (org, isPlant, addOnly = false) => {
            const mutationType = addOnly ? 0 : Math.random();

            if (mutationType < 0.6) { // Add cell (higher chance for growth)
                if (org.cells.length === 0) return;
                const randomBaseCell = org.cells[Math.floor(Math.random() * org.cells.length)];
                const newPos = { x: randomBaseCell.relativeX + Math.floor(Math.random() * 3) - 1, y: randomBaseCell.relativeY + Math.floor(Math.random() * 3) - 1 };
                const posExists = org.cells.some(c => c.relativeX === newPos.x && c.relativeY === newPos.y);

                if (!posExists) {
                    let randomType;
                    do {
                        randomType = Object.values(CELL_TYPES)[Math.floor(Math.random() * Object.values(CELL_TYPES).length)];
                    } while (CONFIG.MOVERS_ARE_MOUTHS && randomType === CELL_TYPES.MOUTH);

                    if (isPlant && randomType === CELL_TYPES.MOVER) return; // Plants can't have movers
                    if (!isPlant && randomType === CELL_TYPES.PRODUCER && !CONFIG.MOVERS_CAN_PRODUCE) return; // Animals can't have producers (unless allowed)

                    org.cells.push(new Cell(randomType, newPos.x, newPos.y));
                }
            } else if (!addOnly && mutationType < 0.8) { // Change cell
                if (org.cells.length === 0) return;
                const randomCell = org.cells[Math.floor(Math.random() * org.cells.length)];
                let newType;
                do {
                    newType = Object.values(CELL_TYPES)[Math.floor(Math.random() * Object.values(CELL_TYPES).length)];
                } while (CONFIG.MOVERS_ARE_MOUTHS && newType === CELL_TYPES.MOUTH);

                if (isPlant && newType === CELL_TYPES.MOVER) return;
                if (!isPlant && newType === CELL_TYPES.PRODUCER && !CONFIG.MOVERS_CAN_PRODUCE) return;

                randomCell.type = newType;
            } else if (!addOnly) { // Remove cell
                // Respect the single-cell life setting
                if (org.cells.length > (CONFIG.ALLOW_SINGLE_CELL ? 1 : 2)) {
                    const cellToRemoveIndex = Math.floor(Math.random() * org.cells.length);
                    // Don't remove the core cell at (0,0)
                    if (org.cells[cellToRemoveIndex].relativeX !== 0 || org.cells[cellToRemoveIndex].relativeY !== 0) {
                        org.cells.splice(cellToRemoveIndex, 1);
                    }
                }
            }
        };

        for (let i = 0; i < CONFIG.INITIAL_ORGANISMS; i++) {
            const x = Math.floor(Math.random() * COLS);
            const y = Math.floor(Math.random() * ROWS);

            const isPlant = Math.random() < CONFIG.PLANT_RATIO;
            let startCells;

            if (isPlant) {
                const producer = new Cell(CELL_TYPES.PRODUCER, 0, 0);
                // Place mouth diagonally to the producer to allow self-sustenance.
                const mouthX = Math.random() < 0.5 ? 1 : -1;
                const mouthY = Math.random() < 0.5 ? 1 : -1;
                const mouth = new Cell(CELL_TYPES.MOUTH, mouthX, mouthY);
                startCells = [producer, mouth];
            } else { // Animal
                if (CONFIG.MOVERS_ARE_MOUTHS) {
                    startCells = [new Cell(CELL_TYPES.MOVER, 0, 0)];
                } else {
                    startCells = [new Cell(CELL_TYPES.MOUTH, 0, 0), new Cell(CELL_TYPES.MOVER, 0, 1)];
                }
                // Chance to also have an eye based on intelligence setting
                if (Math.random() < CONFIG.ANIMAL_INTELLIGENCE_RATIO) {
                    startCells.push(new Cell(CELL_TYPES.EYE, 0, -1));
                }
            }

            const org = new Organism(x, y, startCells);

            // Randomize initial rotation if enabled
            if (CONFIG.ROTATION_ENABLED) {
                org.rotation = Math.floor(Math.random() * 4);
            }

            // Grow to target cell count
            let attempts = 0;
            const minCellCount = CONFIG.ALLOW_SINGLE_CELL ? CONFIG.INITIAL_CELL_COUNT : Math.max(2, CONFIG.INITIAL_CELL_COUNT);
            while (org.cells.length < minCellCount && attempts < 50) {
                performInitialMutation(org, isPlant, true); // Add-only mutations
                attempts++;
            }

            // Apply randomness
            for (let j = 0; j < CONFIG.INITIAL_RANDOMNESS; j++) {
                performInitialMutation(org, isPlant); // Full mutations
            }

            // Finalize organism properties
            org.health = org.cells.length;
            org.lifespan = org.cells.length * CONFIG.LIFESPAN_MULTIPLIER;
            org.speciesId = `hsl(${Math.random() * 360}, 70%, 70%)`;

            // Placement logic
            const canPlace = org.cells.every(cell => {
                const rotated = org.getRotatedCoords(cell);
                const pos = getGridPosition(x + rotated.x, y + rotated.y);
                if (!pos) return false;
                return grid[pos.x] && grid[pos.x][pos.y] && grid[pos.x][pos.y].type === ENTITY_TYPE.EMPTY;
            });

            if (canPlace && org.cells.length > 0) {
                organisms.push(org);
                org.placeOnGrid();
            }
        }
    }

    function placeSingleOrganism(org) {
        const x = Math.floor(COLS / 2);
        const y = Math.floor(ROWS / 2);
        org.x = x;
        org.y = y;

        const canPlace = org.cells.every(cell => {
            const rotated = org.getRotatedCoords(cell);
            const pos = getGridPosition(x + rotated.x, y + rotated.y);
            return pos && grid[pos.x][pos.y].type === ENTITY_TYPE.EMPTY;
        });

        if (canPlace) {
            organisms.push(org);
            org.placeOnGrid();
        }
    }

    function setupPlant() {
        grid = buildGrid();
        organisms = [];
        foodCoords = [];
        const startCells = [
            new Cell(CELL_TYPES.MOUTH, 0, 0),
            new Cell(CELL_TYPES.PRODUCER, -1, -1),
            new Cell(CELL_TYPES.PRODUCER, 1, 1)
        ];
        const org = new Organism(0, 0, startCells); // Temp coords
        placeSingleOrganism(org);
    }

    function setupPopulous() {
        grid = buildGrid();
        organisms = [];
        foodCoords = [];

        if (!mostPopulousOrganismTemplate) {
            // Fallback to default setup if no template is available for any reason
            setup();
            return;
        }

        // Create a deep copy of the cell templates for the new organism
        const startCells = mostPopulousOrganismTemplate.map(c => new Cell(c.type, c.relativeX, c.relativeY));
        const org = new Organism(0, 0, startCells); // Temp coords
        placeSingleOrganism(org);
    }

    function createLegend() {
        const legendContainer = document.getElementById('cell-legend');
        if (!legendContainer) return;
        legendContainer.innerHTML = ''; // Clear previous legend

        const descriptions = {
            'Mouth': 'Consumes food',
            'Producer': 'Creates food',
            'Mover': 'Allows movement',
            'Killer': 'Damages other organisms',
            'Armor': 'Blocks damage',
            'Eye': 'Sees food and others',
            'Mutagen': 'Increases mutation rate'
        };

        const foodDescriptions = {
            'Fresh Food': `Dropped on death (${CONFIG.FRESH_FOOD_ENERGY} energy)`,
            'Regular Food': `Spawned naturally (${CONFIG.REGULAR_FOOD_ENERGY} energy)`,
            'Rotten Food': `Decayed food (${CONFIG.ROTTEN_FOOD_ENERGY} energy)`,
        };

        const extraDescriptions = {
            'Stomach': 'Gets more energy from rotten food',
        };

        const extraItems = [
            {
                name: 'Stomach',
                color: '#FFB300', // Stomach color
                description: extraDescriptions['Stomach']
            }
        ];

        // Organism Cells
        for (const key in CELL_TYPES) {
            const cellType = CELL_TYPES[key];
            const description = descriptions[cellType.name] || '';

            const item = document.createElement('div');
            item.className = 'legend-item';

            const swatch = document.createElement('div');
            swatch.className = 'legend-swatch';
            swatch.style.backgroundColor = cellType.color;

            // Special handling for the eye to draw the pupil
            if (cellType.name === 'Eye') {
                const pupil = document.createElement('div');
                pupil.style.width = '33%';
                pupil.style.height = '33%';
                pupil.style.backgroundColor = 'black';
                swatch.appendChild(pupil);
            }

            const text = document.createElement('span');
            text.className = 'legend-text';
            text.textContent = `${cellType.name}: ${description}`;

            item.appendChild(swatch);
            item.appendChild(text);
            legendContainer.appendChild(item);
        }

        // Food Types
        const foodTypes = [
            { name: 'Fresh Food', color: CONFIG.COLORS.FRESH_FOOD },
            { name: 'Regular Food', color: CONFIG.COLORS.FOOD },
            { name: 'Rotten Food', color: CONFIG.COLORS.ROTTEN_FOOD },
        ];

        foodTypes.forEach(foodType => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            const swatch = document.createElement('div');
            swatch.className = 'legend-swatch';
            swatch.style.backgroundColor = foodType.color;
            const text = document.createElement('span');
            text.className = 'legend-text';
            text.textContent = `${foodType.name}: ${foodDescriptions[foodType.name]}`;
            item.appendChild(swatch);
            item.appendChild(text);
            legendContainer.appendChild(item);
        });

        // Extra Legend Items (like Stomach)
        extraItems.forEach(extra => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            const swatch = document.createElement('div');
            swatch.className = 'legend-swatch';
            swatch.style.backgroundColor = extra.color;
            const text = document.createElement('span');
            text.className = 'legend-text';
            text.textContent = `${extra.name}: ${extra.description}`;
            item.appendChild(swatch);
            item.appendChild(text);
            legendContainer.appendChild(item);
        });
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
                const gridEntity = grid[col][row];
                const x = col * CONFIG.RESOLUTION;
                const y = row * CONFIG.RESOLUTION;

                // --- 1. Draw Background ---
                ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
                ctx.fillRect(x, y, CONFIG.RESOLUTION, CONFIG.RESOLUTION);

                // --- 2. Draw base cell color (food or default organism view) ---
                let baseCellColor = null;
                if (gridEntity.type === ENTITY_TYPE.FOOD) {
                    switch (gridEntity.state) {
                        case 'fresh':
                            baseCellColor = CONFIG.COLORS.FRESH_FOOD;
                            break;
                        case 'rotten':
                            baseCellColor = CONFIG.COLORS.ROTTEN_FOOD;
                            break;
                        default: // 'regular'
                            baseCellColor = CONFIG.COLORS.FOOD;
                    }
                } else if (gridEntity.type === ENTITY_TYPE.ORGANISM_CELL && !CONFIG.INNER_ROUNDED_SKIN) {
                    const cell = gridEntity.cellRef;
                    baseCellColor = (cell.type === CELL_TYPES.MOUTH && cell.stage === 2) ? '#FFB300' : cell.type.color;
                }

                if (baseCellColor) {
                    ctx.fillStyle = baseCellColor;
                    ctx.fillRect(x, y, CONFIG.RESOLUTION, CONFIG.RESOLUTION);
                }

                // --- 4. Draw Organism Skin/Border ---
                if (gridEntity.type === ENTITY_TYPE.ORGANISM_CELL) {
                    const owner = gridEntity.owner;
                    const cell = gridEntity.cellRef;
                    const skinColor = owner.speciesId.replace('hsl', 'hsla').replace(')', `, ${CONFIG.SKIN_OPACITY})`);

                    if (CONFIG.INNER_ROUNDED_SKIN) {
                        const cellColor = (cell.type === CELL_TYPES.MOUTH && cell.stage === 2) ? '#FFB300' : cell.type.color;
                        // Fill background with skin color
                        ctx.fillStyle = skinColor;
                        ctx.fillRect(x, y, CONFIG.RESOLUTION, CONFIG.RESOLUTION);
                        // Draw cell color as a circle on top
                        ctx.fillStyle = cellColor;
                        ctx.beginPath();
                        const radius = (CONFIG.RESOLUTION / 2) - (CONFIG.SKIN_THICKNESS - 1);
                        ctx.arc(x + CONFIG.RESOLUTION / 2, y + CONFIG.RESOLUTION / 2, Math.max(1, radius), 0, 2 * Math.PI);
                        ctx.fill();
                    } else {
                        // Base color is already drawn. Just add the border.
                        const upPos = getGridPosition(col, row - 1), downPos = getGridPosition(col, row + 1), leftPos = getGridPosition(col - 1, row), rightPos = getGridPosition(col + 1, row);
                        const neighborUp = upPos ? grid[upPos.x][upPos.y] : { owner: null }, neighborDown = downPos ? grid[downPos.x][downPos.y] : { owner: null }, neighborLeft = leftPos ? grid[leftPos.x][leftPos.y] : { owner: null }, neighborRight = rightPos ? grid[rightPos.x][rightPos.y] : { owner: null };
                        const isTopExternal = !neighborUp.owner || neighborUp.owner !== owner, isBottomExternal = !neighborDown.owner || neighborDown.owner !== owner, isLeftExternal = !neighborLeft.owner || neighborLeft.owner !== owner, isRightExternal = !neighborRight.owner || neighborRight.owner !== owner;

                        ctx.fillStyle = skinColor;
                        const thickness = CONFIG.SKIN_THICKNESS;
                        if (isTopExternal) ctx.fillRect(x, y, CONFIG.RESOLUTION, thickness);
                        if (isBottomExternal) ctx.fillRect(x, y + CONFIG.RESOLUTION - thickness, CONFIG.RESOLUTION, thickness);
                        if (isLeftExternal) ctx.fillRect(x, y, thickness, CONFIG.RESOLUTION);
                        if (isRightExternal) ctx.fillRect(x + CONFIG.RESOLUTION - thickness, y, thickness, CONFIG.RESOLUTION);
                    }
                }

                // --- 5. Draw Cell Details on Top (Pupils, Spots) ---
                if (gridEntity.type === ENTITY_TYPE.ORGANISM_CELL && gridEntity.cellRef.type === CELL_TYPES.EYE) {
                    ctx.fillStyle = '#000000'; // Black
                    const pupilSize = Math.max(1, Math.floor(CONFIG.RESOLUTION / 3));
                    const pupilOffset = Math.floor((CONFIG.RESOLUTION - pupilSize) / 2);
                    ctx.fillRect(x + pupilOffset, y + pupilOffset, pupilSize, pupilSize);
                }
                if (gridEntity.type === ENTITY_TYPE.FOOD && gridEntity.state === 'rotten') {
                    // Draw static spots if they exist
                    if (gridEntity.spots) {
                        ctx.fillStyle = 'rgba(40, 20, 5, 0.6)';
                        for (const spot of gridEntity.spots) {
                            ctx.fillRect(x + spot.x, y + spot.y, spot.size, spot.size);
                        }
                    }
                }
            }
        }
    }

    function update() {
        for (let i = organisms.length - 1; i >= 0; i--) {
            organisms[i].update();
            if (organisms[i].health <= 0) {
                organisms.splice(i, 1);
            }
        }

        if (Math.random() < CONFIG.FOOD_SPAWN_PROBABILITY) {
            const x = Math.floor(Math.random() * COLS);
            const y = Math.floor(Math.random() * ROWS);
            if (grid[x] && grid[x][y] && grid[x][y].type === ENTITY_TYPE.EMPTY) {
                grid[x][y] = { type: ENTITY_TYPE.FOOD, state: 'regular', age: 0 };
                foodCoords.push({ x, y });
            }
        }

        // Update food decay
        for (let i = foodCoords.length - 1; i >= 0; i--) {
            const coord = foodCoords[i];
            const foodCell = grid[coord.x][coord.y];

            if (foodCell.type !== ENTITY_TYPE.FOOD) {
                foodCoords.splice(i, 1);
                continue;
            }

            foodCell.age++;
            if (foodCell.state === 'fresh' && foodCell.age > CONFIG.FOOD_DECAY_TIME) {
                foodCell.state = 'regular';
                foodCell.age = 0;
            } else if (foodCell.state === 'regular' && foodCell.age > CONFIG.FOOD_DECAY_TIME) {
                foodCell.state = 'rotten';
                foodCell.age = 0;
                // Pre-calculate static spots for rotten food to avoid animation
                foodCell.spots = [];
                const spotSize = Math.max(1, Math.floor(CONFIG.RESOLUTION / 4));
                for (let i = 0; i < 3; i++) {
                    foodCell.spots.push({
                        x: Math.random() * (CONFIG.RESOLUTION - spotSize),
                        y: Math.random() * (CONFIG.RESOLUTION - spotSize),
                        size: spotSize
                    });
                }
            }
        }
    }

    function updateStats() {
        const popCount = organisms.length;
        populationCountSpan.textContent = popCount;

        if (popCount === 0) {
            maxAgeSpan.textContent = 0;
            speciesCountSpan.textContent = 0;
            topSpeciesPopSpan.textContent = 0;
            avgEnergySpan.textContent = '0.00';
            mostPopulousOrganismTemplate = null;
            restartPopulousBtn.disabled = true;
            const popCtx = populousSpawnerCanvas.getContext('2d');
            popCtx.clearRect(0, 0, populousSpawnerCanvas.width, populousSpawnerCanvas.height);

            return;
        }

        const speciesCounts = organisms.reduce((counts, org) => {
            counts[org.speciesId] = (counts[org.speciesId] || 0) + 1;
            return counts;
        }, {});

        const speciesCount = Object.keys(speciesCounts).length;
        const topSpeciesPop = Math.max(0, ...Object.values(speciesCounts));

        if (topSpeciesPop > 0) {
            const topSpeciesId = Object.keys(speciesCounts).reduce((a, b) => speciesCounts[a] > speciesCounts[b] ? a : b);
            const templateOrg = organisms.find(org => org.speciesId === topSpeciesId);
            if (templateOrg) {
                mostPopulousOrganismTemplate = templateOrg.cells.map(c => new Cell(c.type, c.relativeX, c.relativeY, c.stage));
                restartPopulousBtn.disabled = false;
                drawOrganismPreview(populousSpawnerCanvas, mostPopulousOrganismTemplate);
            }
        } else {
            restartPopulousBtn.disabled = true;
        }

        if (popCount > 0) {
            const maxAge = Math.max(...organisms.map(o => o.age));
            const totalEnergy = organisms.reduce((sum, o) => sum + o.energy, 0);
            maxAgeSpan.textContent = maxAge;
            avgEnergySpan.textContent = (totalEnergy / popCount).toFixed(2);
            speciesCountSpan.textContent = speciesCount;
            topSpeciesPopSpan.textContent = topSpeciesPop;
        }
    }

    function gameLoop(timestamp) {
        if (isPaused) {
            return; // Stop the loop if paused.
        }

        // Schedule the next frame.
        animationFrameId = requestAnimationFrame(gameLoop);

        // Throttle updates to the target FPS.
        const elapsed = timestamp - lastFrameTime;
        if (elapsed > 1000 / fps) {
            lastFrameTime = timestamp - (elapsed % (1000 / fps));
            update();
            updateStats();
            drawGrid();
        }
    }

    function performReset(setupFunction) {
        isPaused = true;
        startPauseBtn.textContent = 'Start';
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        updateDimensions();
        setupFunction();
        drawGrid();
        updateStats();
    }

    // --- Event Listeners ---
    startPauseBtn.addEventListener('click', () => {
        if (isPaused) { // If it was paused, we want to start it.
            isPaused = false;
            startPauseBtn.textContent = 'Pause';
            lastFrameTime = performance.now(); // Reset timer to prevent a large jump.
            animationFrameId = requestAnimationFrame(gameLoop); // Kick off the loop.
        } else { // If it was running, we want to pause it.
            isPaused = true;
            startPauseBtn.textContent = 'Start';
            // The loop will stop itself on the next frame because isPaused is true.
        }
    });

    canvas.addEventListener('click', (e) => {
        if (isPaused || !selectedOrganismTemplate) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const col = Math.floor(mouseX / CONFIG.RESOLUTION);
        const row = Math.floor(mouseY / CONFIG.RESOLUTION);

        if (paintOrganism(col, row, selectedOrganismTemplate)) {
            drawGrid(); // Redraw immediately for responsiveness
        }
    });

    const spawnerItems = [plantSpawner, populousSpawner, animalSpawner, smartAnimalSpawner];
    const basicPlantTemplate = [new Cell(CELL_TYPES.PRODUCER, 0, 0), new Cell(CELL_TYPES.MOUTH, 1, 1)];
    const basicAnimalTemplate = [new Cell(CELL_TYPES.MOUTH, 0, 0), new Cell(CELL_TYPES.MOVER, 0, 1)];
    const smartAnimalTemplate = [new Cell(CELL_TYPES.EYE, 0, 0), new Cell(CELL_TYPES.MOUTH, 0, -1), new Cell(CELL_TYPES.MOVER, 0, 1)];

    function selectSpawner(item, template) {
        // Handle case where populous template might be null
        if (!template) {
            return;
        }

        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
            selectedOrganismTemplate = null;
            return;
        }
        spawnerItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        selectedOrganismTemplate = template;
    }

    plantSpawner.addEventListener('click', () => selectSpawner(plantSpawner, basicPlantTemplate));
    populousSpawner.addEventListener('click', () => {
        if (mostPopulousOrganismTemplate) selectSpawner(populousSpawner, mostPopulousOrganismTemplate);
    });
    animalSpawner.addEventListener('click', () => selectSpawner(animalSpawner, basicAnimalTemplate));
    smartAnimalSpawner.addEventListener('click', () => selectSpawner(smartAnimalSpawner, smartAnimalTemplate));

    resetBtn.addEventListener('click', () => performReset(setup));
    restartPlantBtn.addEventListener('click', () => performReset(setupPlant));
    restartPopulousBtn.addEventListener('click', () => {
        if (!restartPopulousBtn.disabled) {
            performReset(setupPopulous);
        }
    });

    // Add resize listener to make the canvas responsive (this also handles entering/exiting fullscreen)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        // Debounce the resize event to avoid excessive resets while dragging the window
        resizeTimeout = setTimeout(() => {
            setupCanvasSize();
            rebuildAfterResize(); // Rebuild the simulation with new dimensions
        }, 250);
    });


    speedSlider.addEventListener('input', (e) => {
        fps = parseInt(e.target.value, 10);
    });
    lifespanSlider.addEventListener('input', (e) => {
        CONFIG.LIFESPAN_MULTIPLIER = parseInt(e.target.value, 10);
    });
    mutationSlider.addEventListener('input', (e) => {
        CONFIG.MUTATION_RATE = parseInt(e.target.value, 10) / 100;
    });
    foodSpawnSlider.addEventListener('input', (e) => {
        CONFIG.FOOD_SPAWN_PROBABILITY = parseFloat(e.target.value);
    });
    freshFoodEnergySlider.addEventListener('input', (e) => {
        CONFIG.FRESH_FOOD_ENERGY = parseFloat(e.target.value);
        createLegend();
    });
    regularFoodEnergySlider.addEventListener('input', (e) => {
        CONFIG.REGULAR_FOOD_ENERGY = parseFloat(e.target.value);
        createLegend();
    });
    rottenFoodEnergySlider.addEventListener('input', (e) => {
        CONFIG.ROTTEN_FOOD_ENERGY = parseFloat(e.target.value);
        createLegend();
    });
    initialPopulationInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            CONFIG.INITIAL_ORGANISMS = value;
        }
    });
    reproductionCostSlider.addEventListener('input', (e) => {
        CONFIG.REPRODUCTION_ENERGY_COST = parseInt(e.target.value, 10);
    });
    metabolicCostSlider.addEventListener('input', (e) => {
        CONFIG.METABOLIC_COST = parseFloat(e.target.value);
    });
    foodDecaySlider.addEventListener('input', (e) => {
        CONFIG.FOOD_DECAY_TIME = parseInt(e.target.value, 10);
    });
    moversCanProduceCheckbox.addEventListener('change', (e) => {
        CONFIG.MOVERS_CAN_PRODUCE = e.target.checked;
    });
    killerDamageSlider.addEventListener('input', (e) => {
        CONFIG.KILLER_CELL_DAMAGE = parseFloat(e.target.value);
    });
    rotationEnabledCheckbox.addEventListener('change', (e) => {
        CONFIG.ROTATION_ENABLED = e.target.checked;
    });
    lookRangeSlider.addEventListener('input', (e) => {
        CONFIG.LOOK_RANGE = parseInt(e.target.value, 10);
    });
    initialCellCountSlider.addEventListener('input', (e) => {
        CONFIG.INITIAL_CELL_COUNT = parseInt(e.target.value, 10);
    });
    initialRandomnessSlider.addEventListener('input', (e) => {
        CONFIG.INITIAL_RANDOMNESS = parseInt(e.target.value, 10);
    });
    plantRatioSlider.addEventListener('input', (e) => {
        CONFIG.PLANT_RATIO = parseInt(e.target.value, 10) / 100;
    });
    reproduceOnFoodCheckbox.addEventListener('change', (e) => {
        CONFIG.REPRODUCE_ON_FOOD = e.target.checked;
    });
    resolutionSlider.addEventListener('input', (e) => {
        CONFIG.RESOLUTION = parseInt(e.target.value, 10);
        resetBtn.click();
    });
    worldWrappingCheckbox.addEventListener('change', (e) => {
        CONFIG.WORLD_WRAPPING = e.target.checked;
    });
    diagonalProductionCheckbox.addEventListener('change', (e) => {
        CONFIG.DIAGONAL_PRODUCTION = e.target.checked;
    });
    skinOpacitySlider.addEventListener('input', (e) => {
        CONFIG.SKIN_OPACITY = parseFloat(e.target.value);
    });
    skinThicknessSlider.addEventListener('input', (e) => {
        CONFIG.SKIN_THICKNESS = parseInt(e.target.value, 10);
    });
    brainMutationSlider.addEventListener('input', (e) => {
        CONFIG.BRAIN_MUTATION_RATE = parseInt(e.target.value, 10) / 100;
    });
    mutagenBonusSlider.addEventListener('input', (e) => {
        CONFIG.MUTAGEN_BONUS = parseInt(e.target.value, 10) / 100;
    });
    cellEvolutionSlider.addEventListener('input', (e) => {
        CONFIG.CELL_EVOLUTION_RATE = parseInt(e.target.value, 10) / 100;
    });
    animalIntelligenceSlider.addEventListener('input', (e) => {
        CONFIG.ANIMAL_INTELLIGENCE_RATIO = parseInt(e.target.value, 10) / 100;
    });
    allowSingleCellCheckbox.addEventListener('change', (e) => {
        CONFIG.ALLOW_SINGLE_CELL = e.target.checked;
    });
    moversAreMouthsCheckbox.addEventListener('change', (e) => {
        CONFIG.MOVERS_ARE_MOUTHS = e.target.checked;
    });
    innerRoundedSkinCheckbox.addEventListener('change', (e) => {
        CONFIG.INNER_ROUNDED_SKIN = e.target.checked;
    });

    // --- Initial State ---
    setupCanvasSize(); // Set initial canvas size based on the window
    performReset(setup); // Perform the initial setup
    createLegend();
    drawOrganismPreview(plantSpawnerCanvas, basicPlantTemplate);
    drawOrganismPreview(animalSpawnerCanvas, basicAnimalTemplate);
    drawOrganismPreview(smartAnimalSpawnerCanvas, smartAnimalTemplate);
});