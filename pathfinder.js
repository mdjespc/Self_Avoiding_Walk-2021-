//Stores all strings of movements that end in being stuck
let terminalstr = []; //Could be a data structure that can sort strings by length

function findPrevCoords(currentIndex, fail)
{
    let prevIndex;
    let prevY;
    let prevX;
    switch(fail)
    {
        case 'u':
            prevIndex = currentIndex + nCols;
            break;
        case 'd':
            prevIndex = currentIndex - nCols;
            break;
        case 'l':
            prevIndex = currentIndex + 1;
            break;
        case 'r':
            prevIndex = currentIndex - 1;
            break;
        default:
            return [-1, -1, -1];
    }
    prevY = floor(prevIndex/nRows);
    prevX = prevIndex % nCols;
    return [prevIndex, prevY, prevX];
}
/*
    Returns a valid movement for the walk.
    'currentPath' contains a string of movements the path has taken before it
    reached a terminal point.
    'fail' contains a single character that leads the currentPath to failure.
    'depth' keeps track of the level of recursion.
*/

function pathfinder(currentPath, fail, currentIndex, depth)
{
    console.log("Back to " + currentPath + "\nFailure at " + fail);
    //Add failure to terminalstr
    terminalstr.push(currentPath.concat("", fail));
    //step 1 - undo failure
    grid[currentIndex] = true;
    path = path.slice(0, pathLength - 2);
    pathLength--;
    let prev_coords = findPrevCoords(currentIndex, fail);
    index = prev_coords[0];
    

    //Visually update grid
    stroke('red');
    let xOffset = width/(nCols*2); 
    let yOffset = height/(nRows*2);
    let prev_y = 2*yOffset*prev_coords[1] + yOffset;
    let prev_x = 2*xOffset*prev_coords[2] + xOffset;
    let y = 2*yOffset*gridY + yOffset;
    let x = 2*xOffset*gridX + xOffset;
    strokeWeight(lineCons);
    line(prev_x, prev_y, x, y);
    strokeWeight(pointCons);
    point(x, y);
    stroke('white');
    gridY = prev_coords[1];
    gridX = prev_coords[2];
    
    //Debug
    console.log("pathLength reduced to " + pathLength + " and path reduced to " + path);
    //step 2 - fetch unexplored options -- room for improvement
    let pathNotFound = true;
    let exploredirs =
    {
        'u': false,
        'd': false,
        'l': false,
        'r': false
    }
    let fetch = searchOptions();
    while(pathNotFound)
    { 
        //if either option ends up in a known failure, skip to next option
        /*
        step 2 - if all options are invalid, we recurse to a version of 
        the string that has one less character and save the current string as a
        failure

        Ex: rdrur is a failure (terminalstr) ---> we call this function with
        parameters 'rdru', 'r', 0
        >>Search for other options that can replace 'r': rdruu, rdrud, rdrul
        >>If all three options are also invalid --> rdru is a failure
        we call this function again using parameters 'rdr', 'u', 1

        If we know rdru is failure, then we no longer need its children rdrur, rdruu,
        rdrud, rdrul in the terminalstr array
        */
        
        if(exploredirs['u'] == true && exploredirs['d'] == true && exploredirs['l'] == true && exploredirs['r'] == true)
        {
            terminalstr.push(currentPath);
            return pathfinder(currentPath.slice(0, currentPath.length - 2), currentPath.charAt(currentPath.length -1), prev_coords[0], depth+1);
        }
        
        exploredirs[fetch[3]] = true;
        for(let i = 0; i < terminalstr.length; i++)
        {
            if(currentPath.concat("",fetch[3]) == terminalstr[i]) break;
            else pathNotFound = false;
        }
        if(pathNotFound) 
        {
            fetch = searchOptions();
            continue;
        }
        return [fetch[0], fetch[1], fetch[2], fetch[3]];
    }
    
}