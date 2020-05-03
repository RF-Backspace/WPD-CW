function filterByTerm(inputArr, searchTerm){
    return inputArr.filter(function(arrayElement){
        return arrayElement.username.match(searchTerm);
    });
}
//Username and password match
describe('Filter function',()=> {
    test('it should filter by a search term(username)',() => {
        const input = [
            {id:1, username:'Tom',password:'pa123'},
            {id:2, username:'ANN',password:'pa123'},
            {id:3, username:'Leo',password:'pa123'},            
        ];

        const output1 = [{id:1, username:'Tom',password:'pa123'}];
        expect(filterByTerm(input,'Tom')).toEqual(output1);
    });
});

//Username matches, password does not match
describe('Filter function',()=> {
    test('it should filter by a search term(username)',() => {
        const input = [
            {id:1, username:'Tom',password:'pa123'},
            {id:2, username:'ANN',password:'pa123'},
            {id:3, username:'Leo',password:'pa123'},            
        ];

        const output2 = [{id:2, username:'ANN',password:'pa1234'}];
        expect(filterByTerm(input,'ANN')).toEqual(output2);
    });
});

//Username mismatch, password match
describe('Filter function',()=> {
    test('it should filter by a search term(username)',() => {
        const input = [
            {id:1, username:'Tom',password:'pa123'},
            {id:2, username:'ANN',password:'pa123'},
            {id:3, username:'Leo',password:'pa123'},            
        ];

        const output2 = [{id:2, username:'Ann',password:'pa123'}];
        expect(filterByTerm(input,'ANN')).toEqual(output2);
    });
});

//Account does not exist
describe('Filter function',()=> {
    test('it should filter by a search term(username)',() => {
        const input = [
            {id:1, username:'Tom',password:'pa123'},
            {id:2, username:'ANN',password:'pa123'},
            {id:3, username:'Leo',password:'pa123'},            
        ];

        const output2 = [{id:4, username:'Sam',password:'pa123'}];
        expect(filterByTerm(input)).toEqual(output2);
    });
});