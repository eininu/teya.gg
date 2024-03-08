import React, { useEffect, useState } from "react";
import AddDomainsModal from "./AddDomainsModal";
import axios from "axios";
import DomainCard from "./DomainCard";
import TagActions from "./TagActions";
import TgSettingsForm from "./SettingsForm";
import Loader from "../components/Loader/Loader";

const PERIODS = [
    {key: 'early', label: 'Less 30 days' },
    {key: 'middle', label: 'More 30 days and less 6 months' },
    {key: 'later', label: 'More than 6 months' }
]

const DEFAULT_TAB = { label: 'All', key: '' }
const NONE_TAB = { label: 'None', key: 'none' }

export default function Monitoring() {
    const [domains, setDomains] = useState(null)
    const [tabs, setTabs] = useState([DEFAULT_TAB, NONE_TAB])
    const [tags, setTags] = useState([])
    const [selectedTab, setSelectedTab] = useState('')
    const [selectedDomains, setSelectedDomains] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [hideAllTabs, setHideAllTabs] = useState(true);

    useEffect(() => {
        getTags()
        getDomains()
    }, []);

    useEffect(() => {
        getDomains({ tag: selectedTab })
    }, [selectedTab]);

    const getDomains = async (params) => {
        setIsLoading(true);

        const { data } = await axios.get("/api/monitoring/monitoring-domains", { params });

        setIsLoading(false);

        if(!data) {
            return;
        }

        setDomains(data)
    }

    const getTags = async () => {
        setIsLoading(true);
        const { data } = await axios.get("/api/tags/get-tags");

        setIsLoading(false);
        if(!data) {
            return;
        }

        const tabs = data.map((tag) => ({ key: tag.id, label: tag.name }))
        setTags(tabs)
        setTabs([DEFAULT_TAB, NONE_TAB,  ...tabs ])
    }

    const addDomains = async ({ domains, tag }) => {
        const parsedDomains = domains.split('\n').filter(Boolean)
        setIsLoading(true);

        const { data } = await axios.post("/api/tags/add-new-domains", { domains: parsedDomains, tag });
        setIsLoading(false);

        if (!data) {
            return;
        }

        getDomains({ tag: selectedTab});
    }

    const getPeriodDomains = (period) => {
        if(!domains) {
            return [];
        }

        return domains[period] ?? []
    }

    const updateDomain = async (id, dto) => {
        setIsLoading(true);

        const { data } = await axios.patch(`/api/monitoring/update/${id}`, dto);
        setIsLoading(false);

        if (!data) {
            return;
        }

        getDomains({ tag: selectedTab});

    }

    const updateTags = async (tagId, action, dto) => {
        setIsLoading(true);
        let result;
        switch (action) {
            case 'attach': {
                result = await axios.patch(`/api/tags/attach-to-tag/${tagId}`, { domainIds: selectedDomains } );
                break;
            }
            case 'unpin': {
                result = await axios.patch(`/api/tags/unpin-from-tag/${tagId}`, { domainIds: selectedDomains } );
                break;
            }
            case 'add': {
                result = await axios.post(`/api/tags/create-tag/`, { ...dto, domainIds: selectedDomains } );
                break;
            }
            case 'edit': {
                result = await axios.patch(`/api/tags/update/${tagId}`, dto );
                break;
            }
            case 'delete': {
                result = await axios.delete(`/api/tags/delete/${tagId}`);
                break;
            }
        }

        setIsLoading(false);
        setSelectedTab('')
        setSelectedDomains([])
        getDomains()
        getTags()
    }

    const handleVisibleTabs = () => {
        setHideAllTabs(!hideAllTabs)
    }

    const deleteDomain = async (domain) => {
        if (window.confirm(`Are you sure you want to delete ${domain.name}?`)) {
            try {
                setIsLoading(true);
                const response = await axios.delete(`/api/monitoring/${domain.id}`);
                setIsLoading(false);
                if (response.status === 200) {
                    alert(`Site ${domain.name} deleted successfully`);
                    getDomains()
                } else {
                    alert("Error deleting site");
                }
            } catch (error) {
                alert("Error sending request to delete the site");
                console.error(error);
            }
        }
    }

    const updateExpiredDate = async (id) => {
        setIsLoading(true);
        const { data } = await axios.patch(`/api/monitoring/update-date/${id}`);

        setIsLoading(false);
        if(!data) {
            return;
        }

        getDomains()
    }

    const updateAllDates = async () => {
        setIsLoading(true);
        const { data } = await axios.patch('/api/monitoring/update-all-dates');
        setIsLoading(false);

        if(!data) {
            return;
        }
        getDomains()
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <Loader isLoading={isLoading} />

            <div className="flex justify-between">
                <AddDomainsModal tags={tags} addDomains={addDomains}/>

                <button
                    type="submit"
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300 ease-in-out"
                    onClick={updateAllDates}
                >
                    Update all dates
                </button>
            </div>

            <TagActions tags={tags} selectedDomains={selectedDomains} updateTags={updateTags}/>

            <div className="flex flex-col gap-1">
                <div className={`flex gap-4 ${hideAllTabs ? "overflow-hidden" : "flex-wrap"}`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setSelectedTab(tab.key)}
                            className={`flex items-center space-x-2 rounded-lg border px-3 py-2.5 font-medium transition  active:border-blue-100 dark:active:border-blue-500 dark:active:border-opacity-25 md:px-5 ${
                                selectedTab === tab.key
                                    ? "border-blue-100 bg-blue-100 text-blue-600 dark:border-transparent dark:bg-blue-500 dark:bg-opacity-20 dark:text-blue-100"
                                    : "border-transparent text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-500 dark:hover:bg-opacity-20 dark:hover:text-blue-100"
                            }`}
                        >
                            { tab.label }
                        </button>
                    ))}
                </div>
                <small className="self-end underline underline-offset-1 cursor-pointer text-red-400" onClick={handleVisibleTabs}>
                    { hideAllTabs ? "show" : "hide" }
                </small>
            </div>
                {
                    PERIODS.map((p) => (
                        <div key={p.key}>
                            <h1 className="mb-2 text-lg font-bold"> { p.label }</h1>
                            {
                                getPeriodDomains(p.key).map((domain) => (
                                    <DomainCard key={domain.name} domain={domain} selectedDomains={selectedDomains}
                                                setSelectedDomains={setSelectedDomains} updateDomain={updateDomain}
                                                deleteDomain={deleteDomain}
                                                updateExpiredDate={updateExpiredDate}
                                    />
                                ))
                            }
                        </div>
                    ))
                }

            <TgSettingsForm />
        </div>
    );
}
