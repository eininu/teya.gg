import React, { useEffect, useState } from "react";
import SelectMenu from "../components/Select";

const ACTIONS_TAGS = [
    {key: 'attach', label: 'Attach'},
    {key: 'unpin', label: 'Unpin'},
    {key: 'add', label: 'Add new tag'},
    {key: 'edit', label: 'Edit tag'},
    {key: 'delete', label: 'Delete tag'},
]

export default function TagActions({ tags, updateTags, selectedDomains }) {
    const [showInput, setShowInput] = useState(false)
    const [newTag, setNewTag] = useState('')
    const [tagAction, setTagAction] = useState('')
    const [selectedTagId, setSelectedTagId] = useState('')
    const [disabled, setDisabled] = useState(true)


    useEffect(() => {
        setSelectedTagId('')
        setNewTag('')
    }, [tags]);

    useEffect(() => {
        let isDisabled = disabled
        if (tagAction === 'add') {
            isDisabled = !newTag
        }

        if (tagAction === 'edit') {
            isDisabled = !newTag
        }

        if (tagAction === 'attach' || tagAction === 'unpin') {
            isDisabled = !selectedTagId || !selectedDomains.length
        }

        if (tagAction === 'delete') {
            isDisabled = !selectedTagId
        }

        setDisabled(isDisabled)
    }, [selectedTagId, tagAction, newTag, selectedDomains]);

    const handleShowInput = (action) => {
        let currentLabel = ''
        let isShowInput = action === 'add'

        if (action === 'edit' && selectedTagId) {
            currentLabel = tags.find(({ key }) => key === selectedTagId).label
            isShowInput = true
        }

        setShowInput(isShowInput)
        setNewTag(currentLabel)
        setTagAction(action)
    }

    const handleSelectedTag = (tagId) => {
        setSelectedTagId(tagId)
    }

    const save = () => {
        updateTags(selectedTagId, tagAction, { name: newTag})
        setShowInput(false)
        setNewTag('')
        setSelectedTagId('')
    }


    return (
        <div className="p-4 flex gap-1 items-end">
            {showInput ? (
                <input
                    className="block w-full rounded-lg border border-gray-200 px-3 py-2 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                    type="text"
                    id="url"
                    name="url"
                    placeholder="Enter tag"
                    defaultValue={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                />
            ) : (
                <>
                    {tags.length > 0 && (
                        <SelectMenu
                            options={tags}
                            label={'Group to selected'}
                            placeholder={'select tag'}
                            handler={handleSelectedTag}
                        />
                    )}
                </>
            )}
            <SelectMenu options={ACTIONS_TAGS} value={ACTIONS_TAGS[0]} handler={handleShowInput}/>
            <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out"
                disabled={disabled}
                onClick={save}
            >
                Save
            </button>
        </div>

    );
}
