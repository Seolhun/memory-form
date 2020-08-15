CoreForm<T>
1. Props
    1. Value
    2. Options
2. State
    1. PrevValue
    2. Value
    3. Error
3. Options
    1. InitValidation
    2. OnChange<T>
    3. OnValidation
4. Methods
    1. Reset
    2. OnChange
    3. OnValidation
5. Computed
    1. Value
    2. IsDirty
    3. HasError


GroupFrom<T>
1. Props
    1. Values
    2. Options
2. State
    1. OriginValues
    2. PrevValues
    3. Values
    4. Errors
3. Options
    1. InitValidation(false)
    2. ValidationType(change, submit)
    3. IsSequence(false)
    4. HasSnapshot(true)
    5. SnapshotSize(20)
    6. Snapshot timeouts(1000)
    7. Validation timeouts(500)
4. Methods
    1. ToValues
    2. OnSubmit
    3. OnChangeValues
    4. OnValidationValues
        1. Debounce
    5. OnSnapshot
        1. Throttle
    6. OnChaneSnapshot
    7. Go
    8. Undo
    9. Redo
5. Computed
    1. IsDirty
    2. HasError
    3. SnapshotSize
    4. HasSnapshot
