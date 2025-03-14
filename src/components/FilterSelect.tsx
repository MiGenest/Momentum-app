import React, { useState, useRef, useEffect } from 'react';
import { fixImageUrl, generateAvatarUrl } from "../utils/imageUrl";

interface Option {
    id: number;
    name?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
}

interface FilterSelectProps {
    options: Option[];
    value: number | number[] | null;
    onChange: (value: number | number[] | null) => void;
    placeholder: string;
    isMulti?: boolean;
    className?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ options, value, onChange, placeholder, isMulti = false, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState<number | number[] | null>(value);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setTempValue(value);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleOptionClick = (optionId: number) => {
        if (isMulti) {
            const currentValues = Array.isArray(tempValue) ? tempValue : [];
            const newValue = currentValues.includes(optionId)
                ? currentValues.filter(id => id !== optionId)
                : [...currentValues, optionId];
            setTempValue(newValue.length ? newValue : []);
        } else {
            setTempValue(optionId === tempValue ? null : optionId);
        }
    };

    const handleConfirm = () => {
        onChange(tempValue);
        setIsOpen(false);
    };

    const getSelectedOptions = () => {
        if (!value) return [];
        const valueArray = Array.isArray(value) ? value : [value];
        return options.filter(option => valueArray.includes(option.id));
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                className="flex items-center justify-between w-full h-full px-[18px] text-sm"
                onClick={() => {
                    setIsOpen(!isOpen);
                    setTempValue(value);
                }}
                type="button"
            >
                <span className="text-[#9B9B9B] font-normal">
                    {placeholder}
                </span>
                <svg
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="#1A1A1A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute w-[688px] h-[274px] top-[55px] left-0 bg-white border-[0.5px] border-[#8338EC] rounded-[10px] p-[10px]">
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-[10px]">
                                {options.map(option => (
                                    <button
                                        key={option.id}
                                        className="flex items-center w-full text-left text-sm hover:bg-[#F9F9F9]"
                                        onClick={() => handleOptionClick(option.id)}
                                        type="button"
                                    >
                                        <div className="flex items-center gap-[10px] w-full p-[10px]">
                                            <div className={`w-[22px] h-[22px] flex items-center justify-center border-[1.5px] rounded-[6px] ${
                                                (Array.isArray(tempValue) ? tempValue : [tempValue]).includes(option.id)
                                                    ? 'border-[#8338EC] bg-[#8338EC]'
                                                    : 'border-[#212529]'
                                            }`}>
                                                {(Array.isArray(tempValue) ? tempValue : [tempValue]).includes(option.id) && (
                                                    <img src="/Check.svg" alt="" className="w-[14px] h-[14px]" />
                                                )}
                                            </div>
                                            {option.avatar && (
                                                <img
                                                    src={generateAvatarUrl(option.first_name || '', option.last_name || '')}
                                                    alt=""
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            )}
                                            <span className="text-[#1A1A1A]">
                                                {option.name || `${option.first_name} ${option.last_name}`}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-[2px] flex justify-end">
                            <button
                                className="bg-[#8338EC] text-white px-8 py-2 rounded-[10px] text-sm font-medium"
                                onClick={handleConfirm}
                                type="button"
                            >
                                არჩევა
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterSelect; 